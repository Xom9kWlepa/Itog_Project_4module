var path = window.location.pathname;
var file = path.substring(path.lastIndexOf("/") + 1);
if (file === "") {
  file = "index.html";
}

var menuLinks = document.querySelectorAll(".menu a");
for (var i = 0; i < menuLinks.length; i++) {
  var href = menuLinks[i].getAttribute("href");
  if (href === file) {
    menuLinks[i].classList.add("active");
  }
}


var eventChips = document.querySelectorAll(".filter-bar .chip");
var eventRows = document.querySelectorAll(".ev-list .ev-row");

for (var c = 0; c < eventChips.length; c++) {
  eventChips[c].addEventListener("click", function () {
    for (var k = 0; k < eventChips.length; k++) {
      eventChips[k].classList.remove("active");
    }
    this.classList.add("active");

    var filter = this.getAttribute("data-filter");
    for (var r = 0; r < eventRows.length; r++) {
      var type = eventRows[r].getAttribute("data-type");
      if (filter === "all" || type === filter) {
        eventRows[r].classList.remove("ev-hidden");
      } else {
        eventRows[r].classList.add("ev-hidden");
      }
    }
  });
}


var tbSummary = document.getElementById("tbSummary");
if (tbSummary) {
  var tbDay = "ПТ";
  var tbDate = "15";
  var tbTime = "20:00";
  var tbPeople = 4;

  function tbWordForm(n) {
    var d1 = n % 10;
    var d2 = n % 100;
    if (d1 === 1 && d2 !== 11) { return "ЧЕЛОВЕК"; }
    if (d1 >= 2 && d1 <= 4 && (d2 < 12 || d2 > 14)) { return "ЧЕЛОВЕКА"; }
    return "ЧЕЛОВЕК";
  }

  function tbUpdate() {
    tbSummary.textContent = tbDay + " · " + tbDate + " МАРТА · " + tbTime + " · " + tbPeople + " " + tbWordForm(tbPeople);
    document.getElementById("tbCount").textContent = tbPeople;
    document.getElementById("tbWord").textContent = tbWordForm(tbPeople);
  }

  var days = document.querySelectorAll(".day");
  for (var i = 0; i < days.length; i++) {
    days[i].addEventListener("click", function () {
      for (var k = 0; k < days.length; k++) { days[k].classList.remove("active"); }
      this.classList.add("active");
      tbDay = this.getAttribute("data-wd");
      tbDate = this.getAttribute("data-d");
      tbUpdate();
    });
  }

  var slots = document.querySelectorAll(".slot");
  for (var j = 0; j < slots.length; j++) {
    slots[j].addEventListener("click", function () {
      for (var k = 0; k < slots.length; k++) { slots[k].classList.remove("active"); }
      this.classList.add("active");
      tbTime = this.getAttribute("data-t");
      tbUpdate();
    });
  }

  document.getElementById("tbMinus").addEventListener("click", function () {
    if (tbPeople > 1) { tbPeople = tbPeople - 1; tbUpdate(); }
  });
  document.getElementById("tbPlus").addEventListener("click", function () {
    if (tbPeople < 14) { tbPeople = tbPeople + 1; tbUpdate(); }
  });
}


var ebPay = document.getElementById("ebPay");
if (ebPay) {
  var ebPrice = 4800;
  var ebCountVal = 2;

  var SHEET_URL = "https://script.google.com/macros/s/AKfycbzIYoyk-Oi_NxfQyAQTLjuBSWVLByuGeDRb8wesNSPUcIA5CNEIt2oR9QKyL356OfrR/exec";

  function ebFormat(n) {
    var s = String(n);
    var out = "";
    var c = 0;
    for (var i = s.length - 1; i >= 0; i--) {
      out = s.charAt(i) + out;
      c++;
      if (c % 3 === 0 && i > 0) { out = " " + out; }
    }
    return out;
  }

  function ebTicketWord(n) {
    var d1 = n % 10;
    var d2 = n % 100;
    if (d1 === 1 && d2 !== 11) { return "БИЛЕТ"; }
    if (d1 >= 2 && d1 <= 4 && (d2 < 12 || d2 > 14)) { return "БИЛЕТА"; }
    return "БИЛЕТОВ";
  }

  function ebUpdate() {
    var total = ebPrice * ebCountVal;
    document.getElementById("ebCount").textContent = ebCountVal;
    document.getElementById("ebWord").textContent = ebTicketWord(ebCountVal);
    document.getElementById("ebTotal").textContent = ebFormat(total) + " ₽";
    document.getElementById("ebPaySum").textContent = ebFormat(total) + " ₽";
  }

  document.getElementById("ebMinus").addEventListener("click", function () {
    if (ebCountVal > 1) { ebCountVal = ebCountVal - 1; ebUpdate(); }
  });
  document.getElementById("ebPlus").addEventListener("click", function () {
    if (ebCountVal < 14) { ebCountVal = ebCountVal + 1; ebUpdate(); }
  });

  function ebCheck(id, ok) {
    var field = document.getElementById(id);
    if (ok) { field.classList.remove("invalid"); }
    else { field.classList.add("invalid"); }
    return ok;
  }

  ebPay.addEventListener("click", async function () {
    var name = document.getElementById("inName").value.trim();
    var last = document.getElementById("inLast").value.trim();
    var phone = document.getElementById("inPhone").value.trim();
    var email = document.getElementById("inEmail").value.trim();

    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    var v1 = ebCheck("fName", name.length > 0);
    var v2 = ebCheck("fLast", last.length > 0);
    var v3 = ebCheck("fPhone", phone.length > 0);
    var v4 = ebCheck("fEmail", emailOk);

    if (!(v1 && v2 && v3 && v4)) { return; }

    var total = ebPrice * ebCountVal;

    if (SHEET_URL !== "") {
      var data = new URLSearchParams();
      data.append("name", name);
      data.append("last", last);
      data.append("phone", phone);
      data.append("email", email);
      data.append("tickets", ebCountVal);
      data.append("total", total);
      data.append("event", "СЛЕПАЯ ДЕГУСТАЦИЯ PLT-015");

      ebPay.disabled = true;
      try {
        await fetch(SHEET_URL, {
          method: "POST",
          mode: "no-cors",
          keepalive: true,
          body: data
        });
      } catch (err) {
        console.error("Не удалось отправить в Google-таблицу:", err);
      }
    } else {
      console.warn("SHEET_URL пустой — данные никуда не отправляются.");
    }

    window.location.href = "404.html";
  });
}


var wineChips = document.querySelectorAll(".wine-filter .chip");
var wineCards = document.querySelectorAll(".wine-grid .wine-card");

for (var w = 0; w < wineChips.length; w++) {
  wineChips[w].addEventListener("click", function () {
    for (var k = 0; k < wineChips.length; k++) { wineChips[k].classList.remove("active"); }
    this.classList.add("active");
    var f = this.getAttribute("data-filter");
    for (var c = 0; c < wineCards.length; c++) {
      var t = wineCards[c].getAttribute("data-type");
      if (f === "all" || t === f) { wineCards[c].classList.remove("wine-hidden"); }
      else { wineCards[c].classList.add("wine-hidden"); }
    }
  });
}


var merchChips = document.querySelectorAll(".m-filter .chip");
var merchCards = document.querySelectorAll(".m-grid .m-card");

for (var m = 0; m < merchChips.length; m++) {
  merchChips[m].addEventListener("click", function () {
    for (var k = 0; k < merchChips.length; k++) { merchChips[k].classList.remove("active"); }
    this.classList.add("active");
    var f = this.getAttribute("data-filter");
    for (var c = 0; c < merchCards.length; c++) {
      var t = merchCards[c].getAttribute("data-type");
      if (f === "all" || t === f) { merchCards[c].classList.remove("m-hidden"); }
      else { merchCards[c].classList.add("m-hidden"); }
    }
  });
}

var addVinyl = document.getElementById("mAddVinyl");
if (addVinyl) {
  var cartCount = 2;
  var cartSum = 5700;

  function cartFormat(n) {
    var s = String(n);
    var out = "";
    var cc = 0;
    for (var i = s.length - 1; i >= 0; i--) {
      out = s.charAt(i) + out;
      cc++;
      if (cc % 3 === 0 && i > 0) { out = " " + out; }
    }
    return out;
  }

  function cartWord(n) {
    var d1 = n % 10;
    var d2 = n % 100;
    if (d1 === 1 && d2 !== 11) { return "ТОВАР"; }
    if (d1 >= 2 && d1 <= 4 && (d2 < 12 || d2 > 14)) { return "ТОВАРА"; }
    return "ТОВАРОВ";
  }

  addVinyl.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    var price = parseInt(this.getAttribute("data-price"), 10);
    cartCount = cartCount + 1;
    cartSum = cartSum + price;
    document.getElementById("mCount").textContent = cartCount;
    document.getElementById("mWord").textContent = cartWord(cartCount);
    document.getElementById("mSum").textContent = cartFormat(cartSum) + " ₽";
  });
}


var itMain = document.getElementById("itMain");
if (itMain) {
  var thumbs = document.querySelectorAll(".it-thumb");
  for (var i = 0; i < thumbs.length; i++) {
    thumbs[i].addEventListener("click", function () {
      for (var k = 0; k < thumbs.length; k++) { thumbs[k].classList.remove("active"); }
      this.classList.add("active");
      itMain.src = this.getAttribute("data-img");
    });
  }

  var itQtyVal = 1;
  document.getElementById("itMinus").addEventListener("click", function () {
    if (itQtyVal > 1) { itQtyVal = itQtyVal - 1; document.getElementById("itQty").textContent = itQtyVal; }
  });
  document.getElementById("itPlus").addEventListener("click", function () {
    itQtyVal = itQtyVal + 1;
    document.getElementById("itQty").textContent = itQtyVal;
  });

  var itFav = document.getElementById("itFav");
  itFav.addEventListener("click", function () {
    if (itFav.classList.contains("saved")) {
      itFav.classList.remove("saved");
      itFav.innerHTML = '<span class="it-heart">♡</span> СОХРАНИТЬ В ИЗБРАННОЕ';
    } else {
      itFav.classList.add("saved");
      itFav.innerHTML = '<span class="it-heart">♥</span> В ИЗБРАННОМ';
    }
  });
}

(function () {
  var DESIGN_WIDTH = 1440;
  var PHONE_BP     = 600;   
  var MAX_ZOOM     = 0;    
  var page = document.querySelector(".page");
  if (!page) return;

  function scaleSite() {
    var w = window.innerWidth;
    if (w > PHONE_BP) {
      var z = w / DESIGN_WIDTH;
      if (MAX_ZOOM && z > MAX_ZOOM) z = MAX_ZOOM;
      page.style.zoom = z.toFixed(4);
    } else {
      page.style.zoom = "";   
    }
  }

  scaleSite();
  var raf;
  window.addEventListener("resize", function () {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(scaleSite);
  });
})();
