import html from "../html.js";
import { useState, useRef, useCallback } from 'https://unpkg.com/preact@latest/hooks/dist/hooks.module.js?module';
import useLocalStorage from "../utils/use-local-storage.js";

const convert = (title, dayList, baseDate, start, end) => {
  console.log(title, dayList, baseDate, start, end);
  const [startHour, startMin] = start.split(":");
  const [endHour, endMin] = end.split(":");
  const result = Papa.unparse({
    header: true,
    fields: ["Subject", "Start Date", "Start Time", "End Date", "End Time"],
    data: dayList.map((day) => {
      const startDjs = dayjs(baseDate).date(day).hour(parseInt(startHour)).minute(parseInt(startMin)).second(0);
      const endDjs = dayjs(baseDate).date(day).hour(parseInt(endHour)).minute(parseInt(endMin)).second(0);
      return [title, startDjs.format("MM/DD/YYYY"), startDjs.format("hh:mm A"), endDjs.format("MM/DD/YYYY"), endDjs.format("hh:mm A")]
    })
  });

  return result;
}

export default {
  title: "日付リストから予定CSVを作る",
  app: () => {
    const inputRef = useRef(null);
    const [inputParsed, setInputParsed] = useState([]);

    const [startTime, setStartTime] = useLocalStorage("13:00", "s2g_start");
    const [endTime, setEndTime] = useLocalStorage("18:00", "s2g_end");
    const [baseDate, setBaseDate] = useState(dayjs(new Date()).add(10, "day"));
    const [title, setTitle] = useLocalStorage("無題の日付リスト", "s2g_title");

    const [result, setResult] = useState("");

    const handleSubmit = useCallback(ev => {
      ev.preventDefault();

      const input = inputRef.current.value;
      const inputParsed = input.split(/[^0-9]/).map(e => parseInt(e)).filter(e => !isNaN(e));

      setInputParsed(inputParsed);

      setResult(convert(title, inputParsed, baseDate, startTime, endTime));
    }, [title, baseDate, startTime, endTime]);

    const handleSave = useCallback(() => {
      saveAs(new Blob([result], { type: "text/plain;charset=utf-8" }), `s2g_cal_${baseDate.format("YYYY-MM-DD")}.csv`);
    }, [result, baseDate]);

    return html`
      <label>Start: <input type="time" value=${startTime} onChange=${useCallback((ev) => { setStartTime(ev.target.value) }, [])} required /></label>
      <label>End: <input type="time" value=${endTime} onChange=${useCallback((ev) => { setEndTime(ev.target.value) }, [])} required /></label>
      <label>Base date (year/month): <input type="date" value=${baseDate.format("YYYY-MM-DD")} onChange=${useCallback((ev) => { setBaseDate(dayjs(ev.target.value, "YYYY/MM/DD").add(10, "day")) }, [])} pattern="\d{4}-\d{2}-\d{2}" required /></label>
      <div>
        <label>Title: <input type="text" value=${title} onChange=${useCallback((ev) => { setTitle(ev.target.value) }, [])} required /></label>
      </div>
      <form onSubmit=${handleSubmit}>
        <textarea ref=${inputRef} placeholder="1, 3, 5, 9, ..." required />
        <button type="submit">変換</button>
      </form>
      <p>
        ${inputParsed.map(e => html`<span class="mendoi__shift2gcal__preview">${e}</span>`)}
        <span>(${inputParsed.length}回)</span>
      </p>
      ${result && html`<textarea readonly value=${result} /><button onClick=${handleSave}>Save</button>`}
      <style>
        .mendoi__shift2gcal__preview {
          margin: 0 0.2em;
          padding: 0 0.2em;
          border: solid 1px #393;
          background-color: #efe;
          border-radius: 0.2em;
        }
      </style>
    `
  }
}
