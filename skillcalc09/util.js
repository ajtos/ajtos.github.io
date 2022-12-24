// name - name of the cookie
// value - value of the cookie
// [expires] - expiration date of the cookie (defaults to end of current session)
// [path] - path for which the cookie is valid (defaults to path of calling document)
// [domain] - domain for which the cookie is valid (defaults to domain of calling document)
// [secure] - Boolean value indicating if the cookie transmission requires a secure transmission
// * an argument defaults when it is assigned null as a placeholder
// * a null placeholder is not required for trailing omitted arguments
function setCookie(name, value, expires, path, domain, secure) {
  var curCookie = name + "=" + escape(value) +
      ((expires) ? "; expires=" + expires.toGMTString() : "") +
      ((path) ? "; path=" + path : "") +
      ((domain) ? "; domain=" + domain : "") +
      ((secure) ? "; secure" : "");
  document.cookie = curCookie;
}

// name - name of the desired cookie
// * return string containing value of specified cookie or null if cookie does not exist
function getCookie(name) {
  var dc = document.cookie;
  var prefix = name + "=";
  var begin = dc.indexOf("; " + prefix);
  if (begin == -1) {
    begin = dc.indexOf(prefix);
    if (begin != 0) return null;
  } else
    begin += 2;
  var end = document.cookie.indexOf(";", begin);
  if (end == -1)
    end = dc.length;
  return unescape(dc.substring(begin + prefix.length, end));
}

///////////////////////////////////////////////////////////////////////////////////////////

var cur_skill;
var cur_slvl;
var hero;
var tab;

function load_values(name, num) {
	hero = name;
	tab = num;
	var values = getCookie(hero+tab);
	if (!values)
		values = "0,0,0,0,0,0,0,0,0,0";
	var list = values.split(",");
	for (var i=0; i < 10; ++i)
	{
		document.forms[0].slvl[i].value = parseInt(list[i]);
		cur_skill = i;
		update[i](data[skills[i]], parseInt(list[i]));
	}
	count_pts();
}

function save_values() {
	var values = "";
	for (var i=0; i < 10; ++i)
	{
		slvl = parseInt(document.forms[0].slvl[i].value);
		if (!(slvl >= 0))
			slvl = 0;
		if (values.length > 0)
			values += ",";
		values += ""+slvl;
	}
	setCookie(hero+tab, values);
}

function pop(pageName) {
	open(pageName + ".html", "popup", "width=321,height=432,resizeable=no,scrollbars=no");
}

function closeWindow() {
	parent.window.close();
}

function add(num) {
	var obj = document.forms[0].slvl[num];
	if (parseInt(obj.value) > 0)
		obj.value = parseInt(obj.value)+1;
	else
		obj.value = 1;
	count_pts();
	show(num);
}

function sub(num) {
	var obj = document.forms[0].slvl[num];
	if (parseInt(obj.value) > 1)
		obj.value = parseInt(obj.value)-1;
	else
		obj.value = 0;
	count_pts();
	show(num);
}

function change(box) {
	count_pts();
	var num = 0;
	var obj = document.forms[0].slvl;
	for (var i=0; i < 10; ++i)
		if (obj[i] == box)
			num = i;
	cur_skill = num;
	update[num](data[skills[num]], parseInt(box.value));
	count_pts();
}

function count_pts() {
	var sum=0;
	for (var i=1; i < 4; ++i)
		if (i != tab)
		{
			var values = getCookie(hero+i);
			if (!values)
				values = "0,0,0,0,0,0,0,0,0,0";
			var list = values.split(",");
			for (j=0; j < 10; ++j)
				sum += parseInt(list[j]);
		}
	for (i=0; i < 10; ++i)
	{
		var val = parseInt(document.forms[0].slvl[i].value);
		if (val >= 0)
			sum += val;
		else
			document.forms[0].slvl[i].value = 0;
	}
	document.getElementById("pts").innerHTML = sum;
}

function reset() {
	var obj = document.forms[0].slvl;
	for (var i=0; i < 10; ++i)
	{
		obj[i].value = 0;
		change(obj[i]);
	}
}

function hide() {
	// next line needed to make the Mac version display, what's wrong though?
	document.getElementById("pts").innerHTML = document.getElementById("pts").innerHTML;
	document.getElementById("b0").style.display = "none";
	document.getElementById("b1").style.display = "none";
	document.getElementById("b2").style.display = "none";
	document.getElementById("b3").style.display = "none";
	document.getElementById("b4").style.display = "none";
	document.getElementById("b5").style.display = "none";
	document.getElementById("b6").style.display = "none";
	document.getElementById("b7").style.display = "none";
	document.getElementById("b8").style.display = "none";
	document.getElementById("b9").style.display = "none";
}

function show(num) {
	hide();
	for (var i=0; i < 10; ++i)
		document.forms[0].slvl[i].blur();
	slvl = parseInt(document.forms[0].slvl[num].value);
	if (slvl > 0)
	{
		document.getElementById("nopts"+num).style.display = "none";
		document.getElementById("lvl"+num).innerHTML = "Current Skill Level: "+slvl;
		cur_skill = num;
		update[num](data[skills[num]], slvl);
		document.getElementById("b"+num).style.color = "white";
		document.getElementById("stats"+num).style.display = "inline";
	}
	else
	{
		document.getElementById("stats"+num).style.display = "none";
		document.getElementById("nopts"+num).style.display = "inline";
		document.getElementById("lvl"+num).innerHTML = "Required Level: "+data[skills[num]][31];
		document.getElementById("b"+num).style.color = "red";
	}
	document.getElementById("b"+num).style.display = "block";
}

function setValue(num, value) {
	document.getElementById("n"+cur_skill+""+num).innerHTML = ""+value;
}

function print(num) {
	document.write('<span id="nopts'+num+'">You have not learned this skill yet<br><br></span>');
	document.write('<b>'+desc[skills[num]][0]+'</b><br>');
	var list = desc[skills[num]][1].split('\n');
	for (i=list.length; i > 0; --i)
		document.write(list[i-1] + '<br>');
	document.write('<span id="lvl'+num+'">Current Skill Level: 0</span><br>');
	document.write('<span id="stats'+num+'"><br>');
	var delay = parseInt(data[skills[num]][42]);
	if (delay > 0)
		document.write('Casting Delay: '+delay/25+' seconds<br>');
	prints[num]();
	document.write('</span>');
}

function min(a, b) {
	return Math.min(a, b);
}

function max(a, b) {
	return Math.max(a, b);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////

function round(num) {
	return Math.round(num);
}

function linear(start, delta, lvl) {
	return parseInt(start)+parseInt(delta)*(lvl-1);
}

function step(start, d1, d2, d3, lvl) {
	if (lvl > 16)
		return parseInt(start)+7*parseInt(d1)+8*parseInt(d2)+(lvl-16)*parseInt(d3);
	else if (lvl > 8)
		return parseInt(start)+7*parseInt(d1)+(lvl-8)*parseInt(d2);
	else
		return parseInt(start)+(lvl-1)*parseInt(d1);
}

function diminish(min, max, lvl) {
	var min_val = parseInt(min);
	var max_val = parseInt(max);
	return min_val+decimal((max_val-min_val)*decimal(110*lvl/(lvl+6), 0)/100, 0);
}

function shift(num) {
	return Math.pow(2, (8-num));
}

function signed(num) {
	if (num < 0)
		return ""+num;
	else
		return "+"+num;
}

function decimal(num, digits) {
	var factor = Math.pow(10, digits);
	return Math.floor(num*factor)/factor;
}

////////////////////////////////////////////////////////////////////////////////////////////////////

function attack(skill, lvl) {
	return linear(skill[76], skill[77], lvl);
}

function mana_mult(skill, lvl, mult) {
	return max(decimal(mult*linear(skill[49], skill[50], lvl)/shift(parseInt(skill[48])), 1), 0);
}

function mana(skill, lvl) {
	return mana_mult(skill, lvl, 1);
}

function magic1(skill, lvl) {
	return step(skill[86], skill[88], skill[89], skill[90], lvl)/shift(parseInt(skill[78]));
}

function magic2(skill, lvl) {
	return step(skill[87], skill[88], skill[89], skill[90], lvl)/shift(parseInt(skill[78]));
}

function dur(skill, lvl) {
	return decimal(step(skill[91], skill[92], skill[93], skill[94], lvl)/25, 1);
}

function physical1(skill, lvl) {
	return step(skill[80], skill[82], skill[83], skill[84], lvl)/shift(parseInt(skill[78]));
}

function physical2(skill, lvl) {
	return step(skill[81], skill[82], skill[83], skill[84], lvl)/shift(parseInt(skill[78]));
}

function source_damage(skill) {
	return 100*(parseInt(skill[79])/8-1);
}

///////////////////////////////////////////////////////////////////////////////////////////////////

function missile_length(num, lvl) {
	var mis = missile[num];
	return decimal(linear(mis[5], mis[6], lvl+1)/25, 1);
}

function missile_range(num, lvl) {
	var mis = missile[num];
	return decimal(linear(mis[5], mis[6], lvl)*2/3, 1);
}

function magic_missile1(num, lvl) {
	var mis = missile[num];
	return step(mis[59], mis[61], mis[62], mis[63], lvl)/shift(parseInt(mis[51]));
}

function magic_missile2(num, lvl) {
	var mis = missile[num];
	return step(mis[60], mis[61], mis[62], mis[63], lvl)/shift(parseInt(mis[51]));
}

function missile_dur(num, lvl) {
	var mis = missile[num];
	return step(mis[64], mis[65], mis[66], mis[67], lvl)/25;
}

///////////////////////////////////////////////////////////////////////////////////////////////////

function monster_life(num, add, lvl) {
	var diff = parseInt(document.forms[1].diff.value);
	var min_life = parseInt(monster[num][158]);
	var max_life = parseInt(monster[num][159]);
	if (diff == 2) {
		min_life = parseInt(monster[num][172]);
		max_life = parseInt(monster[num][173]);
	}
	if (diff == 3) {
		min_life = parseInt(monster[num][185]);
		max_life = parseInt(monster[num][186]);
	}	
	return decimal(decimal((min_life+max_life)/2, 0)*(1+(lvl-1)*parseInt(add)/100), 0);
}

function monster_damage1(num, add, lvl) {
	var diff = parseInt(document.forms[1].diff.value);
	var dam = parseInt(monster[num][163]);
	if (diff == 2)
		dam = parseInt(monster[num][176]);
	if (diff == 3)
		dam = parseInt(monster[num][189]);
	return decimal(decimal(dam, 0)*(1+add/100), 0);
}

function monster_damage2(num, add, lvl) {
	var diff = parseInt(document.forms[1].diff.value);
	var dam = parseInt(monster[num][164]);
	if (diff == 2)
		dam = parseInt(monster[num][177]);
	if (diff == 3)
		dam = parseInt(monster[num][190]);
	return decimal(decimal(dam, 0)*(1+add/100), 0);
}

function monster_defense(num) {
	var diff = parseInt(document.forms[1].diff.value);
	if (diff == 1)
		return parseInt(monster[num][160]);
	if (diff == 2)
		return parseInt(monster[num][174]);
	if (diff == 3)
		return parseInt(monster[num][187]);
}

function monster_attack(num) {
	var diff = parseInt(document.forms[1].diff.value);
	if (diff == 1)
		return parseInt(monster[num][165]);
	if (diff == 2)
		return parseInt(monster[num][178]);
	if (diff == 3)
		return parseInt(monster[num][191]);
}

///////////////////////////////////////////////////////////////////////////////////////////////////

function yards(map) {
	return decimal(decimal(map, 0)*2/3, 1);
}

///////////////////////////////////////////////////////////////////////////////////////////////////
