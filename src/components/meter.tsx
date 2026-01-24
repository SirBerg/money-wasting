import {useEffect, useRef, useState} from "react";
import "../styles/global.css"
import * as translations from "./translations.json"
import {SquarePen} from "lucide-react";

function Leaderboard({updateVisible, lang, mode}: {updateVisible: (visible: boolean) => void, lang:string, mode: "normal" | "less_depressing"}){
    const [leaderboard, setLeaderboard] = useState<Array<{
        meetingName: string,
        moneyWasted: string,
        timeElapsed: number,
        peoplePresent: number
    }>>([])
    useEffect(() => {
        // Fetch leaderboard data from localStorage
        const leaderboardData = localStorage.getItem("leaderboard");
        let leaderboard:Array<{
            meetingName: string,
            moneyWasted: string,
            timeElapsed: number,
            peoplePresent: number
        }> = []
        if(leaderboardData){
            leaderboard = JSON.parse(leaderboardData);
        }
        // Sort leaderboard by money wasted
        leaderboard.sort((a, b) => b.moneyWasted - a.moneyWasted);
        setLeaderboard(leaderboard);
    }, []);
    return(
        <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold flex flex-row justify-between items-center">
                Leaderboard
            </h2>
            <table>
                <thead>
                <tr>
                    <th className="border border-gray-300 p-2">{
                        translations.mode.any.leaderboard_ranking[lang]
                    }</th>
                    <th className="border border-gray-300 p-2">
                        {
                            translations.mode.any.leaderboard_meeting_name[lang]
                        }
                    </th>
                    <th className="border border-gray-300 p-2">{
                        translations.mode[mode].leaderboard_money_wasted[lang]
                    }</th>
                    <th className="border border-gray-300 p-2">
                        {
                            translations.mode.any.leaderboard_time_elapsed[lang]
                        }
                    </th>
                    <th className="border border-gray-300 p-2">{
                        translations.mode.any.leaderboard_people_present[lang]
                    }</th>
                    <th className="border border-gray-300 p-2">Action</th>
                </tr>
                </thead>
                <tbody>
                {
                    leaderboard.length == 0 ?
                        <tr>
                            <td className="border border-gray-300 p-2 text-center" colSpan={6}>{translations.mode.any.leaderboard_not_meetings_saved_yet[lang]}</td>

                        </tr>
                        :
                        leaderboard.map((leaderboardEntry, index)=>{
                            return(
                                <tr key={index}>
                                    <td className="border border-gray-300 p-2 text-center">{index + 1}</td>
                                    <td className="border border-gray-300 p-2 text-center">{leaderboardEntry.meetingName}</td>
                                    <td className="border border-gray-300 p-2 text-center">{leaderboardEntry.moneyWasted}</td>
                                    <td className="border border-gray-300 p-2 text-center">
                                        {
                                            String(Math.floor((leaderboardEntry.timeElapsed / 1000 / 3600) % 60)).padStart(2, '0')
                                        }
                                        :
                                        {
                                            String(Math.floor((leaderboardEntry.timeElapsed / 1000 / 60) % 60)).padStart(2, '0')
                                        }
                                        :
                                        {
                                            String(Math.floor((leaderboardEntry.timeElapsed / 1000) % 60)).padStart(2, '0')
                                        }
                                    </td>
                                    <td className="border border-gray-300 p-2 text-center">{leaderboardEntry.peoplePresent}</td>
                                    <td className="border border-gray-300 p-2 text-center">
                                        <button
                                            className="text-red-500 rounded-md border border-none shadow-sm p-4 grow col-span-2"
                                            onClick={()=>{
                                                const newLeaderboard = leaderboard.filter((_, i) => i !== index);
                                                setLeaderboard(newLeaderboard);
                                                localStorage.setItem("leaderboard", JSON.stringify(newLeaderboard));
                                            }}
                                        >
                                            {
                                                translations.mode.any.leaderboard_action_delete[lang]
                                            }
                                        </button>
                                    </td>
                                </tr>
                            )
                        })

                }
                </tbody>
            </table>
            <button onClick={()=>updateVisible(false)}
                    className="rounded-md border border-none shadow-sm p-4 grow col-span-2 gradient-bg"
            >
                {
                    translations.mode.any.go_back[lang]
                }
            </button>
        </div>
    )
}

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
    const [lang, setLang] = useState("en")
    const [mode, setMode] = useState<"normal" | "less_depressing">("normal")
    const [zenMode, setZenMode] = useState(false)
    const [countDown, setCountDown] = useState(false)
    const [initialAmount, setInitialAmount] = useState(0)
    const [showLeaderboard, setShowLeaderboard] = useState(false)
    const [runSaved, setRunSaved] = useState(false)
    const [disableZenMode, setDisableZenMode] = useState(false)
    const [timeline, setTimeline] = useState<Array<{
        startTime: number,
        endTime: number,
        effect: number
    }>>([])
    useEffect(() => {
        function canGoFullscreen() {
            const el = document.body;
            return (
                typeof el.requestFullscreen !== 'undefined' ||
                typeof el.mozRequestFullScreen !== 'undefined' ||
                typeof el.webkitRequestFullscreen !== 'undefined' ||
                typeof el.msRequestFullscreen !== 'undefined' ||
                typeof document.exitFullscreen !== 'undefined' ||
                typeof document.mozCancelFullScreen !== 'undefined' ||
                typeof document.webkitExitFullscreen !== 'undefined'
            );
        }
        setDisableZenMode(!canGoFullscreen());
        console.log('translations', translations.mode.normal)
    }, []);
    useEffect(() => {
        if(runSaved){
            setTimeout(()=>{
                setRunSaved(false)
            }, 3000)
        }
    }, [runSaved]);
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
        if(countDown){
            new_money_wasted = initialAmount - (new_money_wasted / (1000 * 60 * 60) * salary * people);
        }
        else{
            new_money_wasted = new_money_wasted / (1000 * 60 * 60) * salary * people;
        }
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

    if(showLeaderboard){
        return <Leaderboard updateVisible={setShowLeaderboard} lang={lang} mode={mode}/>
    }

    return(
        <div className="max-w-[400px] mx-auto p-4 text-center flex flex-col gap-4 h-auto">
            <h3 className="text-xl font-bold ">
                {
                    translations.mode[mode]["money_wasted"][lang]
                }
            </h3>
            <div className="text-4xl font-bold flex flex-row gap-2 justify-center items-center">
                {
                    countDown && state === "stopped" ?
                        <div className="flex flex-col gap-1 w-full">
                            <input type="number"
                                   className="max-w-full rounded-md border border-none shadow-sm p-4 grow text-sm"
                                   placeholder="Enter Amount to count down from"
                                   value={initialAmount}
                                   onChange={(e)=>setInitialAmount(Number(e.target.value))}
                            />
                            <div className="text-sm text-gray-500">
                                {translations.mode.any.amount_countdown[lang]}
                            </div>
                        </div>
                        : <div
                            className={moneyWasted < 0 ? "text-red-500" : ""}
                        >
                            {moneyWasted.toFixed(2)}{currency}
                        </div>
                }
                {
                    state === "stopped" ?
                        <button
                            onClick={()=>setCountDown(!countDown)}
                        >
                            <SquarePen/>
                        </button> :
                        null
                }
            </div>
            <h3 className="text-xl font-bold ">
                {
                    translations.mode[mode]["time_elapsed"][lang]
                }
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
                    (state == "running" || state == "paused") && !zenMode ?
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
                            state == "running" ? translations.mode[mode].paused[lang] : translations.mode[mode].continue[lang]
                        }</button>
                        : null
                }
                {
                    state != "paused" && !zenMode ?
                        <button
                            className="rounded-md border border-none shadow-sm p-4 grow"
                            onClick={()=>{
                                if(state == "running") {
                                    const newTimeline = timeline;
                                    newTimeline[newTimeline.length - 1].endTime = Date.now();
                                    setShowPopup(true)
                                    setCountDown(false)
                                }
                                setState(state == "running" ? "stopped" : "running");
                                if(state == "stopped"){
                                    setShowPopup(false)
                                    setTimeline([{
                                        startTime: Date.now(),
                                        endTime: -1,
                                        effect: 1
                                    }])
                                }
                            }}>{state == "running" ? 'Stop' : 'Start'}
                        </button>
                        : null
                }
            </div>
            {
                (state == "running" || state == "paused") && !disableZenMode ?
                    <button
                        id="zenModeButton"
                        className="rounded-md border border-none shadow-sm p-4 grow"
                        onClick={()=>{
                            let zenMode;
                            if(!document.fullscreenElement){
                                zenMode = true
                                document.documentElement.requestFullscreen().then((res)=>{
                                    console.log(res, "entered fullscreen");
                                });
                            }
                            else{
                                zenMode = false
                                document.exitFullscreen();
                            }
                            if(zenMode === undefined){
                                zenMode = false
                            }
                            setZenMode(zenMode);
                        }}
                    >
                        Toggle Zen Mode
                    </button>
                    : null
            }
            {
                state == "paused" ?
                    <blockquote className="flex flex-col gap-1 text-xs text-start border-l-2 border-gray-300 pl-2">
                        <b>{translations.mode[mode].timer_paused_heading[lang]}</b>
                        <div>
                            {
                                translations.mode[mode].timer_paused_answer[lang]
                            }
                        </div>
                    </blockquote>
                    : null
            }
            {
                state == "stopped" ?
                    <div className="flex flex-col gap-2 text-start">
                        <div className="flex flex-col gap-0">
                            <b>{translations.mode[mode].mean_salary_present_heading[lang]}</b>
                            <input
                                type="number"
                                placeholder="Mean Salary of People Present per Hour"
                                className="border border-solid border-gray-300 p-2 rounded-md"
                                value = {salary}
                                onChange={(e)=>setSalary(Number(e.target.value))}
                            ></input>
                        </div>
                        <div className="flex flex-col gap-0">
                            <b>{translations.mode[mode].people_present[lang]}</b>
                            <input
                                type="number"
                                placeholder="People present"
                                className="border border-solid border-gray-300 p-2 rounded-md"
                                value = {people}
                                onChange={(e)=>setPeople(Number(e.target.value))}
                            ></input>
                        </div>
                        <div className="flex flex-col gap-0">
                            <b>{translations.mode[mode].currency[lang]}</b>
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
                        {
                            translations.mode[mode].timer_stopped_heading[lang]
                        }
                        <button
                            className="rounded-md border border-none shadow-sm p-2 gradient-bg"
                            onClick={()=>{
                                // Redirect to teams with prefilled message
                                const message = translations.mode[mode].teams_message[lang].replace("{money}", moneyWasted.toFixed(2)).replace("{hours}", Math.floor((hours / 3600) % 60).toString().padStart(2, '0')).replace("{minutes}", Math.floor((minutes / 60) % 60).toString().padStart(2, '0')).replace("{seconds}", Math.floor(seconds % 60).toString().padStart(2, '0'));
                                const teamsUrl = `https://teams.microsoft.com/l/chat/0/0?users=&message=${encodeURIComponent(message)}`;
                                window.open(teamsUrl, '_blank');
                            }}
                        >
                            Share on Teams
                        </button>
                        {
                            translations.mode[mode].timer_stopped_save_to_leaderboard[lang]
                        }
                        <input
                        type="text"
                        placeholder={translations.mode.any.meeting_name_placeholder[lang]}
                        className="border border-solid border-gray-300 p-2 rounded-md"
                        />
                        <button
                            className="rounded-md border border-none shadow-sm p-4 grow col-span-2 gradient-bg"
                            onClick={()=>{
                                const meetingNameInput = document.querySelector('input[placeholder="Meeting Name"]') as HTMLInputElement;
                                const meetingName = meetingNameInput ? meetingNameInput.value : "Unnamed Meeting";
                                const leaderboardData = localStorage.getItem("leaderboard");
                                let leaderboard:Array<{
                                    meetingName: string,
                                    moneyWasted: string,
                                    timeElapsed: number,
                                    peoplePresent: number
                                }> = []
                                if(leaderboardData){
                                    leaderboard = JSON.parse(leaderboardData);
                                }
                                leaderboard.push({
                                    meetingName: meetingName,
                                    moneyWasted: moneyWasted.toFixed(2) + currency,
                                    timeElapsed: elapsedTime,
                                    peoplePresent: people
                                });
                                // only keep the top 10
                                leaderboard.sort((a, b) => b.moneyWasted - a.moneyWasted);
                                leaderboard = leaderboard.slice(0, 10);
                                localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
                                setRunSaved(true);
                            }}
                        >
                            {
                                runSaved ? translations.mode.any.saved[lang] : translations.mode.any.save_to_leaderboard[lang]
                            }
                        </button>
                    </blockquote>
                    :null
            }
            {
                state == "stopped" ?
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            className="rounded-md border border-none shadow-sm p-4 grow"
                            onClick={()=>{
                                if(lang == "en") setLang("de");
                                else if(lang == "de") setLang("en");
                            }}
                        >
                            {
                                translations.mode.any.change_language[lang]
                            }
                        </button>
                        <button
                            className="rounded-md border border-none shadow-sm p-4 grow"
                            onClick={()=>{
                                if(mode == "normal") setMode("less_depressing");
                                else if(mode == "less_depressing") setMode("normal");
                            }}
                        >
                            {
                                mode == "normal" ? translations.mode.any.less_depressing_mode[lang] :
                                    translations.mode.any.more_depressing_mode[lang]
                            }
                        </button>
                        <button
                            className="rounded-md border border-none shadow-sm p-4 grow col-span-2"
                            onClick={()=>{setShowLeaderboard(true)}}
                        >
                            {
                                translations.mode.any.see_leaderboard[lang]
                            }
                        </button>
                    </div>
                    : null
            }
        </div>
    )
}