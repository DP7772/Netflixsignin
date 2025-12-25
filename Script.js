document.getElementById("text").onblur = function border1()
{
var text = document.getElementById("text");
var textvalue = document.getElementById("text"). value;
var war = document.getElementById("war");
var eye = document.getElementById("eye");
var lock = document.getElementById("lock");
if(textvalue=="")
{
war.style.display ="block"
text.style.border ="1px solid red";
eye.style.position ="absolute";
eye.style.top ="227px";
lock.style.position ="absolute";
lock.style.top ="227px";
}
}

document.getElementById("text"). oninput = function righ()
{
var textvalue = document.getElementById("text"). value;
var right = document.getElementById("right");
var wrong = document.getElementById("wrong");
var war = document.getElementById("war");
var text = document.getElementById("text");
var eye = document.getElementById("eye");
var lock = document.getElementById("lock");
if(textvalue=="Email123@gmail.com")
{
right.style.display ="block";
wrong.style.display ="none";
war.style.display =" none";
text.style.border =" 1px solid white";
}
if(textvalue!="Email123@gmail.com")
{
wrong.style.display ="block";
right.style.display ="none";
}
if(textvalue=="")
{
wrong.style.display ="none";
right.style.display ="none";
war.style.display ="block";
text.style.border ="1px solid red";
eye.style.position ="absolute";
eye.style.top ="227px";
lock.style.position ="absolute";
lock.style.top ="227px";
}
if(textvalue!="")
{
war.style.display ="none";
text.style.border ="2px solid rgba(128,128,128,0.5)";
eye.style.position ="absolute";
eye.style.top ="200px";
lock.style.position ="absolute";
lock.style.top ="200px";
}
}

document.getElementById("pass").onblur = function border2()
{
var pass = document.getElementById("pass");
var passvalue = document.getElementById("pass"). value;
var enter = document.getElementById("enter");
if(passvalue=="")
{
enter.style.display ="block";
pass.style.border ="1px solid red";
}
}

document.getElementById("pass"). oninput = function ps()
{
var passvalue = document.getElementById("pass").value;
var enter = document.getElementById("enter");
var pass = document.getElementById("pass");
if(passvalue!="")
{
enter.style.display ="none";
pass.style.border ="2px solid rgba(128, 128,128,0.5)";
}
if(passvalue=="")
{
enter.style.display ="block";
pass.style.border ="1px solid red";
}
}

document.getElementById("eye").onclick = function akh()
{
var pass = document.getElementById("pass");
var eye = document.getElementById("eye");
var lock = document.getElementById("lock");
pass.type ="text";
eye.style.display ="none";
lock.style.display ="block";
}

document.getElementById("lock").onclick = function lo()
{
var pass = document.getElementById("pass");
var eye = document.getElementById("eye");
var lock = document.getElementById("lock");
pass.type ="password";
eye.style.display ="block";
lock.style.display ="none";
}

document.getElementById("signinbutton").onclick = function media()
{
var textvalue = document.getElementById("text").value;
var passvalue = document.getElementById("pass").value;
if(textvalue=="Email123@gmail.com"&&passvalue=="Password123")
{
window.open("https://internetfloxmedia.netlify.app");
}
if(textvalue!="Email123@gmail.com"|| passvalue!="Password123")
{
window.alert("Please Enter the correct Email and Password")
}

}

document.getElementById("more").onclick = function display()
{
var more = document.getElementById("more");
var policy = document.getElementById("policy");
more.style.display ="none";
policy.style.display ="block";
}

document.getElementById("faq").onclick = function faq()
{
window.open("https://help.netflix.com/support/412");
}

document.getElementById("help").onclick = function help()
{
window.open("https://help.netflix.com/");
}

document.getElementById("terms").onclick = function term()
{
window.open("https://help.netflix.com/legal/termsofuse");
}

document.getElementById("ri").onclick = function ri()
{
window.open("https://help.netflix.com/legal/privacy");
}

document.getElementById("cook").onclick = function cook()
{
window.open("https://netflixsign.netlify.app");
}

document.getElementById("corpor").onclick = function corpor()
{
window.open("https://help.netflix.com/legal/corpinfo");
}