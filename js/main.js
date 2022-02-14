window.onload = function () {
  const loader = document.getElementById("loader");
  if (loader != null) {
    setTimeout(function () {
      let counter = 10;
      const inverval = setInterval(function () {
        document.getElementById("loader").style.opacity = counter / 10;
        if (counter-- <= 0) {
          document.getElementById("loader").style.display = "none";
          clearInterval(inverval);
        }
      }, 50);
    }, 2000);
  }

  const home_page = document.getElementById("home-page");

  const introduction = home_page.getElementsByClassName("introduction")[0];

  const nav = home_page.getElementsByTagName("nav")[0];
  const nav_items = nav.querySelectorAll(".nav-items li");

  const footer = document.getElementsByTagName("footer")[0];

  let page = null;

  const resume_page = document.getElementById("resume-page");
  const circular_charts_box = resume_page.querySelector(".content .skills .circular-charts");
  const canvases = circular_charts_box.querySelectorAll(".circular-chart canvas");
  const progress_bars_box = resume_page.querySelector(".content .skills .full-width");
  const progress_bars = progress_bars_box.querySelectorAll(".half-width .skill .progress-bar");
  let charts = new Array(canvases.length);
  let charts_visible = true, progress_bars_visible = true;
  const int = 15;


  // Typing Animation ---

  var elements = document.getElementsByClassName('txt-rotate');
  for (var i = 0; i < elements.length; i++) {
    var toRotate = elements[i].getAttribute('data-rotate');
    var period = elements[i].getAttribute('data-period');
    if (toRotate) {
      new TxtRotate(elements[i], JSON.parse(toRotate), period);
    }
  }
  // INJECT CSS
  var css = document.createElement("style");
  css.type = "text/css";
  css.innerHTML = ".txt-rotate > .wrap { border-right: 0.08em solid #666 }";
  document.body.appendChild(css);

  // Typing Animation --- End


  for (let i = 0; i < charts.length; i++) {
    charts[i] = new Array(4);

    charts[i][0] = canvases[i].getContext("2d");
    charts[i][1] = 0;
    charts[i][2] = canvases[i].getAttribute("data-percent");
    charts[i][3] = null;
  }

  for (let i = 0; i < nav_items.length; i++) {
    nav_items[i].addEventListener("click", function () {
      if (/\s/.test(nav_items[i].classList))
        return;

      page = document.getElementById(nav_items[i].classList + "-page");

      home_page.style.overflow = "hidden";

      introduction.style.transform = "translateX(-100%)";

      if (getWidth() > 768)
        nav.style.transform = "translateX(100%)";
      else
        nav.style.transform = "translateX(-100%)";

      page.style.display = "block";

      setTimeout(function () {
        home_page.style.visibility = "hidden";
        footer.style.visibility = "visible";
      }, 500);
    });
  }

  window.onscroll = function (e) {
    if (page != null) {
      if (page.id == "resume-page") {
        let charts_offset = document.body.getBoundingClientRect().top + circular_charts_box.getBoundingClientRect().top;
        let progress_bars_offset = document.body.getBoundingClientRect().top + progress_bars_box.getBoundingClientRect().top;

        if (charts_visible) {
          if (charts_offset <= 200) {
            for (let j = 0; j < charts.length; j++) {
              charts[j][0].lineWidth = 3;
              charts[j][0].lineCap = "round";
              charts[j][0].shadowBlur = "5";
              charts[j][0].fillStyle = "#BFBFBF";
              charts[j][0].strokeStyle = "#A51731";
              charts[j][0].textAlign = "center";
              charts[j][0].font = "24px Montserrat, sans-serif";

              charts[j][3] = setInterval(function () {
                drawChart(charts[j][0], charts[j][1]++, charts[j][2], charts[j][3]);
              }, int);
            }

            charts_visible = false;
          }
        }

        if (progress_bars_visible) {
          if (progress_bars_offset <= -500) {
            for (let j = 0; j < progress_bars.length; j++) {
              let max = progress_bars[j].querySelector("span").innerText;
              if (max != "") {
                max = max.substring(0, max.length - 1);

                let al = 0;

                let interval = setInterval(function () {
                  progress_bars[j].style.width = al + "%";
                  if (al++ >= max) {
                    progress_bars[j].querySelector("span").style.opacity = 1;
                    clearTimeout(interval);
                  }
                }, int);
              }
            }

            progress_bars_visible = false;
          }
        }
      }
    }
  };

  document.getElementById("return").addEventListener("click", function () {
    if (page != null) {
      home_page.style.visibility = "visible";

      introduction.style.transform = "translateX(0%)";
      nav.style.transform = "translateX(0%)";

      setTimeout(function () {
        footer.style.visibility = "hidden";
        home_page.style.overflow = "auto";

        page.style.display = "none";
        page = null;

        for (let i = 0; i < charts.length; i++) {
          charts[i][1] = 0;
          charts[i][3] = null;

          charts[i][0].clearRect(0, 0, charts[i][0].canvas.width, charts[i][0].canvas.height);
        }

        for (let j = 0; j < progress_bars.length; j++) {
          progress_bars[j].querySelector("span").style.opacity = 0;
        }

        charts_visible = progress_bars_visible = true;
      }, 500);
    }
  });

  document.getElementById("submit").addEventListener("click", function (e) {
    e.preventDefault();

    var name = document.getElementById("name");
    var email = document.getElementById("email");
    var subject = document.getElementById("subject");
    var message = document.getElementById("message");

    if (isNotEmpty(name) && isNotEmpty(email) && isNotEmpty(subject) && isNotEmpty(message)) {
      const xhr = new XMLHttpRequest();

      xhr.onload = function () {
        if (JSON.parse(this.responseText)["response"] == "success")
          alert('Message has been sent!');
        else
          alert('Something went wrong, please re-check the given information!');
      }

      xhr.open("POST", "sendEmail.php");
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhr.send("name=" + name.value + "&" + "email=" + email.value + "&" + "subject=" + subject.value + "&" + "message=" + message.value);
    }
  });

  function isNotEmpty(caller) {
    if (caller.value == "") {
      alert("Please fill in all the information!")
      return false;
    }

    return true;
  }
};

function drawChart(ctx, al, max, timer) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.fillText(al + "%", ctx.canvas.width / 2, (ctx.canvas.width / 2) + 10, ctx.canvas.width);

  ctx.beginPath();
  ctx.arc(ctx.canvas.width / 2, ctx.canvas.width / 2, (ctx.canvas.width / 2) - ctx.lineWidth, 4.72, (((al / 100) * Math.PI * 2 * 10) / 10) + 4.72, false);
  ctx.stroke();

  if (al >= max)
    clearTimeout(timer);
};


// Typing Animation ---

var TxtRotate = function (el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = '';
  this.tick();
  this.isDeleting = false;
};

TxtRotate.prototype.tick = function () {
  var i = this.loopNum % this.toRotate.length;
  var fullTxt = this.toRotate[i];

  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';

  var that = this;
  // var delta = 300 - Math.random() * 100;
  var delta = 75;

  if (this.isDeleting) {
    delta /= 2;
  }

  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
  } else if (this.isDeleting && this.txt === '') {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
  }

  setTimeout(function () {
    that.tick();
  }, delta);
};

// Typing Animation --- End

function getWidth() {
  return Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  );
}

function getHeight() {
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.documentElement.clientHeight
  );
}
