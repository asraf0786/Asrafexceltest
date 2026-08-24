const defaultQuestions=[
["What is the shortcut key to save an Excel workbook?",["Ctrl + C","Ctrl + S","Ctrl + V","Ctrl + P"],1],
["Which symbol is used to start a formula in Excel?",["#","@","=","&"],2],
["Which function is used to add numbers?",["COUNT","SUM","AVERAGE","MAX"],1],
["What is the intersection of a row and column called?",["Table","Cell","Range","Sheet"],1],
["Which shortcut copies selected data?",["Ctrl + X","Ctrl + Z","Ctrl + C","Ctrl + A"],2],
["Which function calculates the average?",["SUM","COUNT","AVERAGE","MIN"],2],
["Which function returns the highest value?",["MAX","MIN","HIGH","TOP"],0],
["Which function returns the lowest value?",["MAX","MIN","LOW","BOTTOM"],1],
["Which function counts cells containing numbers?",["COUNT","COUNTA","COUNTBLANK","SUM"],0],
["Which shortcut undoes the last action?",["Ctrl + Y","Ctrl + U","Ctrl + Z","Ctrl + D"],2],
["Which Excel tab is commonly used to insert a chart?",["Insert","Review","Data","View"],0],
["Which function checks a condition and returns different results?",["IF","SUM","LEFT","MAX"],0],
["Which function counts cells meeting one condition?",["COUNTIF","COUNT","COUNTA","SUMIF"],0],
["Which function adds values meeting one condition?",["SUMIF","SUM","COUNTIF","AVERAGE"],0],
["Which function can add values using multiple conditions?",["SUMIFS","SUM","COUNTIFS","IF"],0],
["Which function can count records using multiple conditions?",["COUNTIFS","COUNTIF","SUMIFS","COUNTA"],0],
["VLOOKUP searches primarily in which direction?",["Vertically","Horizontally","Diagonally","Randomly"],0],
["Which combination is commonly used as a flexible alternative to VLOOKUP?",["INDEX + MATCH","SUM + IF","MAX + MIN","LEFT + RIGHT"],0],
["Which function returns today's date?",["NOWDATE","TODAY","DATE","CURRENT"],1],
["Which function returns the day number from a date?",["DAY","DATE","YEAR","WEEKDAY"],0],
["Which function returns the month number from a date?",["MONTH","MON","DATE","YEAR"],0],
["Which function returns the year from a date?",["YEAR","DATE","MONTH","WEEKDAY"],0],
["Which function extracts characters from the left side of text?",["LEFT","RIGHT","MID","LEN"],0],
["Which function extracts characters from the right side of text?",["LEFT","RIGHT","MID","LEN"],1],
["Which function returns the number of characters in text?",["LEN","COUNT","TEXT","MID"],0],
["Which feature restricts what users can enter in a cell?",["Data Validation","Sort","Filter","Freeze Panes"],0],
["Which feature can highlight cells based on rules?",["Conditional Formatting","Find","Merge","Protect"],0],
["Which tool removes repeated records?",["Remove Duplicates","Filter","Sort","Subtotal"],0],
["Which shortcut selects the entire worksheet?",["Ctrl + A","Ctrl + S","Ctrl + F","Ctrl + H"],0],
["Which function calculates a loan payment?",["PMT","FV","PV","RATE"],0]
].map(([question,options,answer])=>({question,options,answer}));

let customQuestions=JSON.parse(localStorage.getItem("nexoraCustomQuestions")||"[]");
let settings=JSON.parse(localStorage.getItem("nexoraSettings")||"{}");
let quiz=[],current=0,score=0,answers=[];

const $=id=>document.getElementById(id);
function allQuestions(){return [...defaultQuestions,...customQuestions]}
function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function loadQuestionCount(){ $("questionStat").textContent=allQuestions().length;$("customStat").textContent=customQuestions.length }
function renderCustomList(){
 const box=$("customList");box.innerHTML="";
 customQuestions.forEach((q,i)=>{const d=document.createElement("div");d.className="customItem";d.innerHTML=`<span>${i+1}. ${escapeHTML(q.question)}</span><button class="danger" onclick="deleteCustomQuestion(${i})">Delete</button>`;box.appendChild(d)});
 if(!customQuestions.length)box.innerHTML="<p class='muted'>No custom questions added yet.</p>";
}
function escapeHTML(s){const d=document.createElement("div");d.textContent=s;return d.innerHTML}
function addCustomQuestion(){
 const question=$("newQuestion").value.trim();
 const options=[$("optA").value.trim(),$("optB").value.trim(),$("optC").value.trim(),$("optD").value.trim()];
 const answer=Number($("correctAnswer").value);
 if(!question||options.some(x=>!x)){alert("Please fill Question and all 4 options.");return}
 customQuestions.push({question,options,answer});
 localStorage.setItem("nexoraCustomQuestions",JSON.stringify(customQuestions));
 ["newQuestion","optA","optB","optC","optD"].forEach(id=>$(id).value="");$("correctAnswer").value="0";
 loadQuestionCount();renderCustomList();alert("Question added successfully!");
}
function deleteCustomQuestion(i){if(confirm("Delete this question?")){customQuestions.splice(i,1);localStorage.setItem("nexoraCustomQuestions",JSON.stringify(customQuestions));loadQuestionCount();renderCustomList()}}
function clearCustomQuestions(){if(confirm("Delete ALL custom questions?")){customQuestions=[];localStorage.removeItem("nexoraCustomQuestions");loadQuestionCount();renderCustomList()}}
function startQuiz(){
 const n=Math.min(Number($("questionsPerQuiz").value),allQuestions().length);
 quiz=shuffle(allQuestions()).slice(0,n);current=0;score=0;answers=[];
 $("result").style.display="none";$("liveScore").textContent=0;$("quiz").scrollIntoView({behavior:"smooth"});loadQuestion();
}
function loadQuestion(){
 const q=quiz[current];$("qNumber").textContent=`Question ${current+1} of ${quiz.length}`;$("questionText").textContent=q.question;
 $("progress").style.width=`${(current/quiz.length)*100}%`;$("feedback").textContent="";$("nextBtn").style.display="none";$("options").innerHTML="";
 q.options.forEach((op,i)=>{const b=document.createElement("button");b.className="option";b.textContent=`${"ABCD"[i]}. ${op}`;b.onclick=()=>selectAnswer(i);$("options").appendChild(b)});
}
function selectAnswer(selected){
 const q=quiz[current],buttons=[...document.querySelectorAll(".option")];buttons.forEach((b,i)=>{b.disabled=true;if(i===q.answer)b.classList.add("correct");else if(i===selected)b.classList.add("wrong")});
 const correct=selected===q.answer;if(correct)score++;
 answers.push({q,selected,correct});$("liveScore").textContent=score;$("feedback").textContent=correct?"✓ Correct Answer!":"✗ Wrong Answer!";
 $("feedback").style.color=correct?"#22c55e":"#ef4444";$("nextBtn").style.display="inline-block";
}
function nextQuestion(){current++;if(current<quiz.length)loadQuestion();else showResult()}
function showResult(){
 const wrong=quiz.length-score,pct=Math.round(score/quiz.length*100),grade=pct>=90?"A+":pct>=80?"A":pct>=70?"B":pct>=60?"C":pct>=50?"D":"F";
 $("finalScore").textContent=`${score} / ${quiz.length}`;$("correctCount").textContent=score;$("wrongCount").textContent=wrong;$("percentCount").textContent=pct+"%";$("gradeCount").textContent=grade;
 $("resultMessage").textContent=pct===100?"Perfect! You are an Excel Master! 🔥":pct>=70?"Excellent work! Keep practicing! 🌟":pct>=50?"Good job! Practice more to improve. 👍":"Keep learning and try again! 💪";
 let best=Number(localStorage.getItem("nexoraBestScore")||0);if(pct>best){best=pct;localStorage.setItem("nexoraBestScore",best)}$("bestStat").textContent=best+"%";
 $("progress").style.width="100%";$("result").style.display="block";$("result").scrollIntoView({behavior:"smooth"});
}
function restartQuiz(){startQuiz()}
function reviewAnswers(){
 const box=$("reviewList");box.innerHTML=answers.map((a,i)=>`<div class="reviewItem"><b>Q${i+1}. ${escapeHTML(a.q.question)}</b><br>Your answer: ${escapeHTML(a.q.options[a.selected])}<br>Correct answer: ${escapeHTML(a.q.options[a.q.answer])}</div>`).join("");
}
function exportQuestions(){
 const data=JSON.stringify({customQuestions,exportedAt:new Date().toISOString()},null,2),blob=new Blob([data],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="nexora-questions-backup.json";a.click();URL.revokeObjectURL(a.href);
}
function importQuestions(e){
 const file=e.target.files[0];if(!file)return;
 const reader=new FileReader();reader.onload=()=>{try{
  let added=[];
  if(file.name.toLowerCase().endsWith(".json")){
    const data=JSON.parse(reader.result);added=data.customQuestions||data;if(!Array.isArray(added))throw Error("Invalid JSON")
  }else{
    const lines=reader.result.split(/\r?\n/).filter(Boolean);lines.slice(1).forEach(line=>{const p=line.split(",").map(x=>x.trim().replace(/^"|"$/g,""));if(p.length>=6){let a=p[5].toUpperCase();let ans="ABCD".includes(a)?"ABCD".indexOf(a):Number(a);if(ans>=0&&ans<=3)added.push({question:p[0],options:[p[1],p[2],p[3],p[4]],answer:ans})}})
  }
  added=added.filter(q=>q&&q.question&&Array.isArray(q.options)&&q.options.length===4&&Number.isInteger(Number(q.answer)));
  customQuestions.push(...added);localStorage.setItem("nexoraCustomQuestions",JSON.stringify(customQuestions));loadQuestionCount();renderCustomList();alert(`${added.length} questions imported successfully.`);
 }catch(err){alert("Could not import file. Use a valid JSON backup or CSV with the shown format.")}};
 reader.readAsText(file);e.target.value="";
}
function toggleSettings(){$("settingsPanel").classList.toggle("show");$("overlay").classList.toggle("show")}
function applySettings(){
 const s={brand:$("setBrand").value||"NEXORA",heading:$("setHeading").value||"CREATE. LEARN. GROW.",subtitle:$("setSubtitle").value||"Test your Microsoft Excel knowledge with interactive MCQ questions and improve your skills.",bg:$("bgColor").value,accent:$("accentColor").value,text:$("textColor").value,fontSize:$("fontSize").value,font:$("fontFamily").value,count:$("questionsPerQuiz").value};
 document.documentElement.style.setProperty("--bg",s.bg);document.documentElement.style.setProperty("--accent",s.accent);document.documentElement.style.setProperty("--text",s.text);document.body.style.fontSize=s.fontSize+"px";document.body.style.fontFamily=s.font+", Arial, sans-serif";
 $("brandName").textContent=s.brand;$("footerBrand").textContent=s.brand;$("mainHeading").textContent=s.heading;$("subHeading").textContent=s.subtitle;document.title=s.brand+" Excel Quiz";return s;
}
function saveSettings(){settings=applySettings();localStorage.setItem("nexoraSettings",JSON.stringify(settings))}
function resetSettings(){localStorage.removeItem("nexoraSettings");location.reload()}
function initSettings(){
 const s={brand:"NEXORA",heading:"CREATE. LEARN. GROW.",subtitle:"Test your Microsoft Excel knowledge with interactive MCQ questions and improve your skills.",bg:"#0b1020",accent:"#7c3aed",text:"#ffffff",fontSize:"16",font:"Arial",count:"10",...settings};
 $("setBrand").value=s.brand;$("setHeading").value=s.heading;$("setSubtitle").value=s.subtitle;$("bgColor").value=s.bg;$("accentColor").value=s.accent;$("textColor").value=s.text;$("fontSize").value=s.fontSize;$("fontFamily").value=s.font;$("questionsPerQuiz").value=s.count;applySettings();
}
function init(){initSettings();loadQuestionCount();renderCustomList();$("bestStat").textContent=(localStorage.getItem("nexoraBestScore")||0)+"%"}
init();