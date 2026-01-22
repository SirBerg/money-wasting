import {useEffect, useRef, useState} from "react";
import "../styles/global.css"
export default function Meter(){
    const [state, setState] = useState<"running" | "paused" | "stopped">("stopped");
    const [elapsedTime, setElapsedTime] = useState(0)
    const [showPopup, setShowPopup] = useState(false)
    const [clock, setClock] = useState(false)
    const [seconds, setSeconds] = useState(0)
    const [minutes, setMinutes] = useState(0)
    const [hours, setHours] = useState(0)
    const [people, setPeople] = useState(0)
    const [salary, setSalary] = useState(0)
    const [currency, setCurrency] = useState("€")
    const [moneyWasted, setMoneyWasted] = useState(0)
    const [timeline, setTimeline] = useState<Array<{
        startTime: number,
        endTime: number,
        effect: number
    }>>([])

    // Clock generator
    useEffect(() => {
        setTimeout(()=>{
            setClock(!clock)
        }, 1000)
    }, [clock]);

    // Time renderer
    useEffect(() => {
        if(state === "paused" || state === "stopped") return
        let time_to_render = 0;
        for(const element of timeline){
            time_to_render = time_to_render + element.effect * ((element.endTime == -1 ? Date.now() : element.endTime) - element.startTime);
        }
        setElapsedTime(time_to_render);
    }, [clock]);

    // Money renderer
    useEffect(()=>{
        if(!timeline[0] || state === "stopped") return
        let new_money_wasted = Date.now() - timeline[0].startTime
        new_money_wasted = new_money_wasted / (1000 * 60 * 60) * salary * people;
        setMoneyWasted(new_money_wasted);
    }, [clock])
    useEffect(() => {
        console.log(timeline)
    }, [timeline]);
    useEffect(() => {
        setSeconds(elapsedTime / 1000);
        setMinutes(elapsedTime / 1000);
        setHours(elapsedTime / 1000);
    }, [elapsedTime]);

    return(
        <div className="max-w-[400px] mx-auto p-4 text-center flex flex-col gap-4 h-auto">
            <h3 className="text-xl font-bold ">
                Money wasted
            </h3>
            <div className="text-4xl font-bold">
                {moneyWasted.toFixed(2)}€
            </div>
            <h3 className="text-xl font-bold ">
                Time Elapsed
            </h3>
            <div className="text-4xl font-bold">
                {
                    String(Math.floor((hours / 3600) % 60)).padStart(2, '0')
                }
                :
                {
                    String(Math.floor((minutes / 60) % 60)).padStart(2, '0')
                }
                :
                {
                    String(Math.floor(seconds % 60)).padStart(2, '0')
                }
            </div>

            <div className="flex flex-row gap-2">
                {
                    state == "running" || state == "paused" ?
                        <button
                            className="rounded-md border border-none shadow-sm p-4 grow"
                            onClick={()=>{
                                if(state == "paused"){
                                    setState("running")
                                    const newTimeline = timeline;
                                    newTimeline[newTimeline.length - 1].endTime = Date.now();
                                    newTimeline.push({
                                        startTime: Date.now(),
                                        endTime: -1,
                                        effect: 1
                                    });
                                    setTimeline(newTimeline);
                                }
                                else{
                                    setState("paused");
                                    const newTimeline = timeline;
                                    newTimeline[newTimeline.length - 1].endTime = Date.now();
                                    newTimeline.push({
                                        startTime: Date.now(),
                                        endTime: -1,
                                        effect: -1
                                    })
                                    setTimeline(newTimeline);
                                }
                            }}
                        >{
                            state == "running" ? 'Pause' : 'Resume'
                        }</button>
                        : null
                }
                {
                    state != "paused" ?
                        <button
                            className="rounded-md border border-none shadow-sm p-4 grow"
                            onClick={()=>{
                                if(state == "running") {
                                    const newTimeline = timeline;
                                    newTimeline[newTimeline.length - 1].endTime = Date.now();
                                    setShowPopup(true)
                                }
                                setState(state == "running" ? "stopped" : "running");
                                if(state == "stopped"){
                                    setTimeline([{
                                        startTime: Date.now(),
                                        endTime: -1,
                                        effect: 1
                                    }])
                                }
                                else{
                                    const newTimeline = timeline;
                                    newTimeline[newTimeline.length - 1].endTime = Date.now();
                                }
                            }}>{state == "running" ? 'Stop' : 'Start'}
                        </button>
                        : null
                }
            </div>
            {
                state == "paused" ?
                    <blockquote className="flex flex-col gap-1 text-xs text-start border-l-2 border-gray-300 pl-2">
                        <b>I've paused the timer! Why does the money still increase?</b>
                        <div>
                            The timer is paused, but you are still wasting money! You've just paused your meeting, you aren't done yet!
                        </div>
                    </blockquote>
                    : null
            }
            {
                state == "stopped" ?
                    <div className="flex flex-col gap-2 text-start">
                        <div className="flex flex-col gap-0">
                            <b>Mean Salary of People Present (per Hour)</b>
                            <input
                                type="number"
                                placeholder="Mean Salary of People Present per Hour"
                                className="border border-solid border-gray-300 p-2 rounded-md"
                                value = {salary}
                                onChange={(e)=>setSalary(Number(e.target.value))}
                            ></input>
                        </div>
                        <div className="flex flex-col gap-0">
                            <b>People Present</b>
                            <input
                                type="number"
                                placeholder="People present"
                                className="border border-solid border-gray-300 p-2 rounded-md"
                                value = {people}
                                onChange={(e)=>setPeople(Number(e.target.value))}
                            ></input>
                        </div>
                        <div className="flex flex-col gap-0">
                            <b>Currency</b>
                            <input
                                type="text"
                                placeholder="Currency"
                                className="border border-solid border-gray-300 p-2 rounded-md"
                                value = {currency}
                                onChange={(e)=>setCurrency(e.target.value)}
                            ></input>
                        </div>
                    </div>
                    : null
            }
            {
                showPopup ?
                    <blockquote className="flex flex-col gap-2 border-l-2 border-gray-300 pl-2">
                        Great job! You've stopped the timer. If you want, you can share your results on teams:
                        <button
                            className="rounded-md border border-none shadow-sm p-2 gradient-bg"
                            onClick={()=>{
                                // Redirect to teams with prefilled message
                                const message = `I just wasted ${moneyWasted.toFixed(2)}${currency} in ${Math.floor((hours / 3600) % 60).toString().padStart(2, '0')}:${Math.floor((minutes / 60) % 60).toString().padStart(2, '0')}:${Math.floor(seconds % 60).toString().padStart(2, '0')} hours of meeting!`;

                                const teamsUrl = `https://teams.microsoft.com/l/chat/0/0?users=&message=${encodeURIComponent(message)}`;
                                window.open(teamsUrl, '_blank');
                            }}
                        >
                            Share on Teams
                        </button>
                    </blockquote>
                    :null
            }
        </div>
    )
}