"use strict";
function getJson(a, b) {
  $.ajax({
    type: "GET",
    url: a,
    dataType: "json",
    success: b,
    error: function() {
      b(null )
    }
  })
}
function loadMarket(a) {
  var b;
  b = exSimulator.isFirstRace === !0
    ? exSimulator.racesPath + exSimulator.fourRunnerRace
    : exSimulator.racesPath + raceList[Math.floor(Math.random() * raceList.length)],
    getJson(b, function(b) {
        a(new Race(b)),
          exSimulator.isFirstRace = !1
      }
    )
}
function loadRaceList(a) {
  getJson(exSimulator.racesList, function(b) {
      raceList = b,
        loadRace(a)
    }
  )
}
function loadRace(a) {
  null === raceList ? loadRaceList(a) : loadMarket(a)
}
function ListIterator(a) {
  this.ptr = -1,
    this.l = a
}
function SortedList(a) {
  this.cells = [],
    this.compare = a
}
function getFractionalOdds(a) {
  function b(a) {
    return "1/1" === a ? betEngineConfigurations.miscellaneous.labelEvens : a
  }
  var c, d, e, f, g, h, i, j = "";
  return a / a === 1 && a >= 1.01 && 1e3 >= a && (c = betEngineConfigurations.bets.oddsConversions.lookupTable.length,
    betEngineConfigurations.bets.oddsConversions.lookupTable.forEach(function(k, l) {
        if (d = k[0],
            e = k[1],
            f = k[2],
          d === a)
          j = b([e, "/", f].join(""));
        else if (a > d && l + 1 !== c && betEngineConfigurations.bets.oddsConversions.lookupTable[l + 1][0] > a) {
          if (g = betEngineConfigurations.bets.oddsConversions.lookupTable[l + 1],
              h = g[1],
              i = g[2],
            e / f !== h / i)
            return j = [betEngineConfigurations.miscellaneous.labelBetween + " ", b([e, "/", f].join("")), " & ", b([h, "/", i].join(""))].join("");
          j = b([e, "/", f].join(""))
        }
        return j
      }
      , this)),
    j
}
function MarketPosition(a) {
  this.market = a,
    this.exposure = 0,
    this.backBook = 0,
    this.layBook = 0,
    this.hasPotentialBackBets = !1,
    this.hasPotentialLayBets = !1,
    this.hasMatchedPosition = !1,
    this.hasValidationErrors = !1,
    this.validationErrors = [],
    this.isPlaceable = !1,
    this.hasMatchedLays = !1,
    this.hasMatchedBacks = !1,
    this.hasUnmatchedPosition = !1,
    this.hasUnmatchedLays = !1,
    this.hasUnmatchedBacks = !1,
    a.mp = this,
    a.runners.forEach(function(a) {
        var b = new RP(this,a);
        a.rp = b
      }
      , this)
}
function SelectionCtrl(a) {
  var b = parseLocation();
  loadSelection(b.eventId, b.marketId, b.selectionId, null , null , function(a) {
      for (var c = [], d = 0, e = 0, f = 0, g = 0; g < a.tvSeries.length; g++) {
        var h = a.tvSeries[g];
        e += h.price * h.size,
          f += h.size,
          c.push([new Date(h.ts), h.size, e / f, h.price]),
        h.size > d && (d = h.size)
      }
      new Dygraph(document.getElementById("graph-div"),c,{
        title: b.selectionId + "",
        labels: ["Time", "Vol", "VWAP", "Price"],
        series: {
          VWAP: {
            strokeWidth: 2,
            color: "blue"
          },
          Price: {
            strokeWidth: 2,
            color: "red"
          },
          Vol: {
            axis: "y2",
            strokeWidth: 2,
            color: "gray",
            plotter: barChartPlotter
          }
        },
        axes: {
          y: {
            valueRange: [1, null ]
          },
          y2: {
            valueRange: [0, null ],
            labelsKMB: !0,
            label: "Vol",
            independentTicks: !0
          }
        },
        ylabel: "Price",
        y2label: "Volume",
        labelsSeparateLines: !0
      })
    }
  )
}
function loadSelection(a, b, c, d, e, f) {
  var g = "/data/market/selection/?marketId=" + b + "&eventId=" + a + "&selectionId=" + c;
  null  != d && (g += "&from=" + d),
  null  != e && (g += "&to=" + e),
    $.ajax({
      type: "GET",
      url: g,
      dataType: "json",
      success: function(a) {
        f(a)
      },
      error: function() {
        f(null )
      }
    })
}
function barChartPlotter(a) {
  var b = a.drawingContext
    , c = a.points
    , d = a.dygraph.toDomYCoord(0);
  b.strokeStyle = a.color;
  for (var e = 0; e < c.length; e++) {
    var f = c[e]
      , g = f.canvasx;
    b.beginPath(),
      b.moveTo(g, d),
      b.lineTo(g, f.canvasy),
      b.stroke()
  }
}
function parseLocation() {
  var a, b, c = window.location.search, d = c.substring(1).split("&"), e = {};
  for (b in d)
    "" !== d[b] && (a = d[b].split("="),
      e[decodeURIComponent(a[0])] = decodeURIComponent(a[1]));
  return e
}
window.EXW = window.EXW || {},
  window.EXW.CONST = {
    breakpoints: {
      desktop: 1024
    }
  },
  $(function() {
      var a, b = window.EXW;
      for (a in b)
        b.hasOwnProperty(a) && "function" == typeof b[a].init && b[a].init();
      b.cookie = function(a, b, c, d) {
        var e, f, g, h = new Date, i = b + "=", j = document.cookie.split(";");
        if (d !== !1 && void 0 !== d || "r" === a || (d = -1),
          d && (h.setTime(h.getTime() + 24 * d * 60 * 60 * 1e3),
            e = "; expires=" + h.toGMTString()),
          "c" === a || "create" === a)
          return document.cookie = b + "=" + c + e + "; path=/",
            !0;
        if ("d" === a || "delete" === a)
          return document.cookie = b + "=; expires=-1; path=/",
            !0;
        if ("r" === a || "read" === a) {
          for (f = 0; f < j.length; f--) {
            for (g = j[f]; " " === g.charAt(0); )
              g = g.substring(1, g.length);
            if (0 === g.indexOf(i))
              return g.substring(i.length, g.length)
          }
          return !1
        }
        return !1
      }
    }
  );
var BF = BF || {};
BF.horseRaceSimulator = BF.horseRaceSimulator || {},
  BF.horseRaceSimulator.Horse = function(a, b) {
    var c = b || 8
      , d = this;
    BF.horseRaceSimulator.SpriteSheet.apply(this),
      this.initSpritesheet(a),
      this.onImageLoad(function() {
          d.gotoAndStop(c)
        }
      )
  }
;
var BF = BF || {};
BF.horseRaceSimulator = BF.horseRaceSimulator || {},
  BF.horseRaceSimulator.SpriteSheet = function() {
    function a() {
      o && cancelAnimationFrame(o)
    }
    function b() {
      t === p - 1 && (u = Math.max(r, (u + 1) % i)),
        t = (t + 1) % p
    }
    function c(a) {
      var b = Math.floor(a / j)
        , c = Math.floor(a % j);
      return {
        row: b,
        col: c
      }
    }
    function d(a, b) {
      var d = c(u)
        , e = d.row
        , f = d.col;
      h.drawImage(m, f * k, e * l, k, l, a, b, k, l)
    }
    function e() {
      h.clearRect(0, 0, k, l)
    }
    function f() {
      for (var a = v.length, b = 0; a > b; b++)
        v[b]()
    }
    function g() {
      o = requestAnimationFrame(g),
        e(),
        b(),
        d(0, 0)
    }
    var h, i, j, k, l, m, n, o, p, q = 2, r = 1, s = !1, t = 0, u = 0, v = [];
    this.onImageLoad = function(a) {
      "function" == typeof a && v.push(a)
    }
      ,
      this.startAnimation = function() {
        s || (g(),
          s = !0)
      }
      ,
      this.stopAnimation = function() {
        a(),
          e(),
          d(0, 0),
          s = !1
      }
      ,
      this.setFrameDelay = function(a) {
        p = a >= q ? a : q
      }
      ,
      this.increaseSpeed = function() {
        var a = p - 1;
        p = a >= q ? a : q
      }
      ,
      this.decreaseSpeed = function() {
        p++
      }
      ,
      this.initSpritesheet = function(a) {
        n = a.imagePath,
          k = a.frameWidth,
          l = a.frameHeight,
          p = a.frameDelay,
          i = a.endFrame,
          j = a.canvasElement.width,
          r = void 0 !== a.animStartFrame && "number" == typeof a.animStartFrame ? a.animStartFrame : r,
          h = a.canvasElement.getContext("2d"),
          m = new Image,
          m.src = n,
          m.onload = function() {
            j = Math.floor(m.width / k),
              f()
          }
      }
      ,
      this.gotoAndStop = function(a) {
        u = a,
          this.stopAnimation()
      }
      ,
      this.isPlaying = function() {
        return s
      }
  }
;
var exSimulator = exSimulator || {};
angular.module("betsim", []),
  exSimulator.minStake = 2,
  exSimulator.skipRecalcOnFastForward = !0,
  exSimulator.maxHorsePosition = 98.7,
  exSimulator.isFirstRace = !0,
  exSimulator.fourRunnerRace = "1.116867687.json",
  exSimulator.racesPath = "assets/races/",
  exSimulator.racesList = exSimulator.racesPath + "races.json";
var raceList = null
  , Selection = function(a) {
    var b = exSimulator.prices;
    this.selectionId = a,
      this.name = exSimulator.horseNames[a % exSimulator.horseNames.length],
      this.emptyLadder = function() {
        for (var a = [], c = 0; c < b.length; c++)
          a.push(0);
        return a
      }
      ,
      this.raw_atb = this.emptyLadder(),
      this.raw_atl = this.emptyLadder(),
      this._atb = [],
      this._atl = [],
      this.atb = [],
      this.atl = [],
      this.ltp = null ,
      this.unmatchedBets = [],
      this.matchedBets = [],
      this.update = function(a) {
        if (a.atb) {
          for (var c = 0; c < a.atb.length; c += 2)
            this.raw_atb[a.atb[c]] = a.atb[c + 1];
          this._atb = [];
          for (var c = 0; c < this.raw_atb.length; c++)
            this.raw_atb[c] > 0 && this._atb.push({
              price: b[c],
              size: this.raw_atb[c]
            })
        }
        if (a.atl) {
          for (var c = 0; c < a.atl.length; c += 2)
            this.raw_atl[a.atl[c]] = a.atl[c + 1];
          this._atl = [];
          for (var c = 0; c < this.raw_atl.length; c++)
            this.raw_atl[c] > 0 && this._atl.push({
              price: b[c],
              size: this.raw_atl[c]
            })
        }
        a.ltp && -1 !== a.ltp && (this.ltp = b[a.ltp])
      }
      ,
      this.recalc = function() {
        var a = new Matcher;
        a.execute(this._atb, this._atl, this.matchedBets, this.unmatchedBets, this.atb, this.atl);
      }
  }
  , Race = function(a) {
    var b = Math.log(32);
    this.iterator = new ListIterator(a),
      this.complete = !0,
      this.numWinners = 1,
      this.runners = [],
      this.runnerMap = {},
      this.tv = 0,
      this.state = null,
      this.distance = 0;
    for (var c = 0; c < a[0].selectionIds.length; c++) {
      var d = new Selection(a[0].selectionIds[c]);
      d.saddleCloth = c + 1,
        this.runners.push(d),
        this.runnerMap[d.selectionId] = d
    }
    new MarketPosition(this),
      this.recalc = function() {
        this.atbBook = 0,
          this.atlBook = 0;
        for (var a = 0; a < this.runners.length; a++) {
          var c = this.runners[a];
          c.recalc();
          var d = 1e3;
          if (c.ltp ? d = c.ltp : null  !== c.atb[0] && (d = c.atb[0].price),
              c.displayPrice = d,
            "INPLAY" === this.state) {
            var e, f = 1e3;
            f = c.displayPrice <= 16 ? Math.log(c.displayPrice) / b + .08 : .2 * (c.displayPrice - 16) / 84 + .8,
              e = (90 * f).toFixed(2),
            e > exSimulator.maxHorsePosition && (e = exSimulator.maxHorsePosition),
              c.displayPosition = e
          } else
            100 === this.pctRace ? c.displayPosition = -60 - Math.floor(50 * Math.random()) : c.displayPosition = 88;
          null  !== c.atb[0] ? this.atbBook += 1 / c.atb[0].price : this.atbBook += 1,
          null  !== c.atl[0] && (this.atlBook += 1 / c.atl[0].price)
        }
        this.mp.recalc()
      }
      ,
      this.next = function(a) {
        if (this.iterator.hasNext()) {
          var b = this.iterator.next();
          if (this.state = b.state,
              this.tv = b.tv,
            b.timeToOff && (this.timeToOff = new Date(b.timeToOff)),
              this.pctRace = b.pctRace,
              b.runnerUpdates)
            for (var c = 0; c < b.runnerUpdates.length; c++) {
              var d = b.runnerUpdates[c]
                , e = this.runnerMap[d.selectionId];
              e.update(d)
            }
          if (a || this.recalc(),
            "CLOSED" === b.state) {
            this.mp.cancelAll();
            for (var c = 0; c < this.runners.length; c++) {
              var e = this.runners[c];
              if (e.unmatchedBets = [],
                e.selectionId === b.winner) {
                this.settlement = {
                  winner: e.name,
                  profit: this.mp.hasMatchedPosition ? e.rp.netMatchedProfitIfWin : 0
                };
                break
              }
            }
          }
        }
      }
      ,
      this.next()
  }
  ;
angular.module("betsim").controller("appCtrl", ["$scope", "$timeout", function(a, b) {
  function c(a) {
    b(function() {
        $("#price_" + a).focus()
      }
    )
  }
  function d() {
    a.loading = true;
    loadRace(function(b) {
        var raceLengths = [1000, 1200, 1400, 1700, 1800, 2200, 2800], maxPoints = 400,
          divisor = maxPoints / raceLengths.length,
          points = (b.iterator.l || []).filter(function(point) {
              return point.state === 'INPLAY';
            }).length,
          index = Math.floor(points / divisor) - 1;
        a.market = b,
          a.market.distance = raceLengths[Math.min(index, raceLengths.length - 1)],
          o(),
          a.loading = false;
          a.$apply()
      }
    )
  }
  function e(b) {
    var timeoutId;
    a.playing && a.market.next(),
      n(),
    b || a.$apply(),
      timeoutId = window.setTimeout(function() {
        a.market.runners.forEach(function(runner) {
          runner.atb.forEach(function(odds) { odds && delete odds.changed });
          runner.atl.forEach(function(odds) { odds && delete odds.changed });
        });
        a.$apply();
          window.clearTimeout(timeoutId);
      }, 500),
    a.playing && window.setTimeout(e, 1e3)
  }
  function f() {
    if (a.started && g()) {
      var b, c, d = 0, e = a.market.runners.length;
      for (c = 0; e > c; c++)
        b = a.market.runners[c],
        b.displayPosition > d && (d = b.displayPosition);
      100 > d && (d = 200),
        a.stallPosition = d
    }
  }
  function g() {
    return a.market && "INPLAY" === a.market.state
  }
  function h() {
    return a.market && "CLOSED" === a.market.state
  }
  function i() {
    a.isEnvInMotion = a.isHorseInMotion = g()
  }
  function j() {
    a.isEnvInMotion = a.isHorseInMotion = a.playing
  }
  function k(b) {
    for (; h() === !1 && a.market.pctRace < b; )
      a.market.next(exSimulator.skipRecalcOnFastForward);
    a.market.recalc()
  }
  function l() {
    a.isHorseInMotion = !1
  }
  function m() {
    var b = 0;
    a.market.runners.forEach(function(a) {
        a.rp.potentialBackBet && (a.rp.potentialBackBet.idx = ++b)
      }
    ),
      a.market.runners.forEach(function(a) {
          a.rp.potentialLayBet && (a.rp.potentialLayBet.idx = ++b)
        }
      ),
      a.placeButtonIdx = ++b
  }
  function n() {
    for (var b = !0, c = !1, d = 0; d < a.market.runners.length; d++) {
      var e = a.market.runners[d]
        , f = e.rp.matchedPayout;
      if (e.cashoutBets = [],
          e.cashoutProfitIfWin = e.rp.matchedProfitIfWin,
          e.cashoutProfitIfLose = e.rp.matchedProfitIfLose,
          !(Math.abs(f) < .005))
        if (0 > f) {
          for (var g = 0; g < e.atl.length; g++) {
            var h = e.atl[g];
            if (null  == h)
              break;
            var i = -f / h.price
              , j = Math.min(h.size, i);
            if (f += j * h.price,
                e.cashoutBets.push({
                  price: h.price,
                  size: j,
                  side: "LAY"
                }),
                e.cashoutProfitIfWin -= (h.price - 1) * j,
                e.cashoutProfitIfLose += j,
                c = !0,
              Math.abs(f) < .005)
              break
          }
          if (Math.abs(f) >= .005) {
            b = !1;
            break
          }
        } else if (f > 0) {
          for (var g = 0; g < e.atb.length; g++) {
            var h = e.atb[g];
            if (null  == h)
              break;
            var i = f / h.price
              , j = Math.min(h.size, i);
            if (f -= j * h.price,
                e.cashoutBets.push({
                  price: h.price,
                  size: j,
                  side: "BACK"
                }),
                e.cashoutProfitIfWin += (h.price - 1) * j,
                e.cashoutProfitIfLose -= j,
                c = !0,
              Math.abs(f) < .005)
              break
          }
          if (Math.abs(f) >= .005) {
            b = !1;
            break
          }
        }
    }
    if (c && b) {
      for (var k = 0, d = 0; d < a.market.runners.length; d++)
        k += a.market.runners[d].cashoutProfitIfLose;
      a.cashout.possible = !0,
        a.cashout.profit = k - a.market.runners[0].cashoutProfitIfLose + a.market.runners[0].cashoutProfitIfWin
    } else
      a.cashout.possible = !1,
        a.cashout.profit = 0
  }
  function o() {
    a.market.recalc(),
      n()
  }
  function p() {
    a.market.mp.cancelAll()
  }
  var q = 4;
  a.mgr = null ,
    a.playing = !1,
    a.isEnvInMotion = !1,
    a.isHorseInMotion = !1,
    a.started = !1,
    a.betslipState = "PLACE",
    a.stallPosition = 88,
    a.options = {
      layBetPayoutLiability: "liability"
    },
    a.loading = false,
    a.$watch("market.pctRace", function(b) {
        b > 99 && (a.isEnvInMotion = !1)
      }
    ),
    a.$watch("market.state", function(a) {
        switch (a) {
          case "CLOSED":
            b(l, 1e3 * q);
            break;
          case "INPLAY":
            i(),
              f()
        }
      }
    ),
    a.isBtnPlayDisabled = function() {
      return a.loading || a.playing || h()
    }
    ,
    a.isBtnPauseDisabled = function() {
      return a.loading || !a.playing || h()
    }
    ,
    a.isBtnSkipToStartDisabled = function() {
      return a.loading || h() || g()
    }
    ,
    a.isBtnSkipToEndDisabled = function() {
      return a.loading || h() || !g()
    },
    a.isBtnNewRaceDisabled = function() {
      return a.loading;
    }
    ,
    a.restart = function() {
      a.playing = !1,
        a.isEnvInMotion = !1,
        a.isHorseInMotion = !1,
        a.started = !1,
        a.betslipState = "PLACE",
        a.stallPosition = 88,
        a.loading = true,
        d()
    }
    ,
    a.play = function() {
      a.playing || (a.playing = !0,
      a.started || (a.started = !0,
        f()),
        i(),
        e(!0))
    }
    ,
    a.pause = function() {
      a.playing = !1,
        j()
    }
    ,
    a.skipToStart = function() {
      //if (!a.playing) {
        for (; g() === !1; )
          a.market.next(exSimulator.skipRecalcOnFastForward);
        a.market.recalc(),
          a.play()
      //}
    }
    ,
    a.skipToEnd = function() {
      a.skipToStart(),
        k(98)
    }
    ,
    a.runToStart = function() {
      if (!a.playing)
        for (; g() === !1; )
          a.market.next()
    }
    ,
    a.runToEnd = function() {
      if (!a.playing)
        for (; h() === !1; )
          a.market.next()
    }
    ,
    a.recalcPotentials = function() {
      a.market.mp.recalc()
    }
    ,
    a.cancelBet = function(a) {
      a.cancel(),
        o(),
        m()
    }
    ,
    a.cancelUnmatchedBet = function(a, b) {
      var c = a.unmatchedBets.indexOf(b);
      a.unmatchedBets.splice(c, 1),
        o()
    }
    ,
    a.cancelAllUnmatched = function() {
      a.market.runners.forEach(function(a) {
          a.unmatchedBets = []
        }
      ),
        o()
    }
    ,
    a.confirmPlacement = function() {
      a.market.runners.forEach(function(a) {
          if (a.unmatchedBets || (a.unmatchedBets = []),
            null  != a.rp.potentialBackBet) {
            var b = a.rp.potentialBackBet;
            a.unmatchedBets.push({
              price: b.price,
              size: b.size,
              side: b.side
            })
          }
          if (null  != a.rp.potentialLayBet) {
            var b = a.rp.potentialLayBet;
            a.unmatchedBets.push({
              price: b.price,
              size: b.size,
              side: b.side
            })
          }
        }
      ),
        p(),
        o(),
        a.betslipState = "OPENBETS"
    }
    ,
    a.back = function(b, d) {
      null  != b.rp.potentialBackBet ? b.rp.potentialBackBet.hasPrice() && b.rp.potentialBackBet.price == d || !b.rp.potentialBackBet.hasPrice() && null  == d ? b.rp.potentialBackBet.cancel() : b.rp.potentialBackBet.price = d : b.rp.addPBet("BACK", d),
        a.betslipState = "PLACE",
        o(),
        m(),
      null  != b.rp.potentialBackBet && c(b.rp.potentialBackBet.idx)
    }
    ,
    a.lay = function(b, d) {
      null  != b.rp.potentialLayBet ? b.rp.potentialLayBet.hasPrice() && b.rp.potentialLayBet.price == d || !b.rp.potentialLayBet.hasPrice() && null  == d ? b.rp.potentialLayBet.cancel() : b.rp.potentialLayBet.price = d : b.rp.addPBet("LAY", d),
        a.betslipState = "PLACE",
        o(),
        m(),
      null  != b.rp.potentialLayBet && c(b.rp.potentialLayBet.idx)
    }
    ,
    a.cashout = function() {
      a.cashout.possible && (a.market.runners.forEach(function(a) {
          a.unmatchedBets = []
        }
      ),
        a.market.runners.forEach(function(a) {
            a.cashoutBets.forEach(function(b) {
                a.matchedBets.push(b)
              }
            )
          }
        ),
        p(),
        o(),
        a.betslipState = "OPENBETS")
    }
    ,
    a.backAll = function() {
      var b = null ;
      a.market.runners.forEach(function(a) {
          null  == a.rp.potentialBackBet && (a.rp.addPBet("BACK", a.atb[0] ? a.atb[0].price : null ),
          null  == b && (b = a.rp.potentialBackBet))
        }
      ),
        o(),
        m(),
      null  != b && c(b.idx),
        a.betslipState = "PLACE"
    }
    ,
    a.layAll = function() {
      var b = null ;
      a.market.runners.forEach(function(a) {
          null  == a.rp.potentialLayBet && (a.rp.addPBet("LAY", a.atl[0] ? a.atl[0].price : null ),
          null  == b && (b = a.rp.potentialLayBet))
        }
      ),
        o(),
        m(),
      null  != b && c(b.idx),
        a.betslipState = "PLACE"
    }
    ,
    a.getFractionalPrice = function(a) {
      a.fractionalPrice = getFractionalOdds(a.price)
    }
    ,
    d()
}
]),
  angular.module("betsim").directive("cos", ["$animate", function(a) {
    return {
      link: function(a, b, c) {
        var d = c.cos.split(":")
          , e = d[0]
          , f = d[1];
        a.$watch(f, function(a) {
            b.removeClass(e),
              setTimeout(function() {
                  b.addClass(e)
                }
                , 1)
          }
        )
      }
    }
  }
  ]),
  angular.module("betsim").directive("pandl", function() {
      return {
        link: function(a, b, c) {
          a.$watch(c.pandl, function(a) {
              void 0 != a && null  != a ? (0 > a ? (b.removeClass("green"),
                b.addClass("red")) : (b.removeClass("red"),
                b.addClass("green")),
                b.text((0 > a ? "-" : "") + "$" + Math.abs(a).toFixed(2))) : (b.removeClass("green"),
                b.removeClass("red"),
                b.text(""))
            }
          )
        }
      }
    }
  ),
  angular.module("betsim").directive("stakeInput", function() {
      var a = /^[1-9]\d*(\.\d{0,2})?$/
        , b = function(b) {
          return a.test(b) ? parseFloat(b) : NaN
        }
        , c = function(a, c, d) {
          var e, f = c.$viewValue;
          f ? (e = b(f) + (d ? .01 : -.01),
          e < exSimulator.minStake && (e = exSimulator.minStake)) : e = exSimulator.minStake,
          e && a.$apply(function() {
              c.$setViewValue(e.toFixed(2)),
                c.$render()
            }
          )
        }
        ;
      return {
        require: "ngModel",
        link: function(a, d, e, f) {
          var g = "";
          d.bind("focus", function(a) {
              d.select()
            }
          ),
            d.bind("keydown keypress", function(b) {
                38 === b.which ? (b.preventDefault(),
                  c(a, f, !0)) : 40 === b.which && (b.preventDefault(),
                  c(a, f, !1))
              }
            ),
            d.bind("blur", function(a) {
                var c = f.$viewValue;
                "" != c && b(c) < exSimulator.minStake && (alert("Min stake is " + exSimulator.minStake),
                  f.$setViewValue(exSimulator.minStake.toFixed(2)),
                  f.$render())
              }
            ),
            f.$formatters.push(function(a) {
                return a && a < exSimulator.minStake ? f.$setValidity("stake", !1) : f.$setValidity("stake", !0),
                  a
              }
            ),
            f.$parsers.push(function(a) {
                if ("" == a)
                  g = "";
                else {
                  var c = b(a);
                  if (isNaN(c) ? (f.$setViewValue(g),
                      f.$render(),
                      c = b(g)) : g = f.$viewValue,
                      !isNaN(c))
                    return c >= exSimulator.minStake ? f.$setValidity("stake", !0) : f.$setValidity("stake", !1),
                      c
                }
                return void f.$setValidity("stake", !1)
              }
            )
        }
      }
    }
  ),
  angular.module("betsim").directive("priceInput", function() {
      var a = /^[1-9]\d{0,3}(\.\d{0,2})?$/
        , b = function(b) {
          return a.test(b) ? parseFloat(b) : NaN
        }
        , c = function(a, c, d) {
          var e, f = c.$viewValue;
          e = f ? PriceLadder.nudge(b(f), d) : d ? PriceLadder.minPrice : PriceLadder.maxPrice,
          e && a.$apply(function() {
              c.$setViewValue(e),
                c.$render()
            }
          )
        }
        ;
      return {
        require: "ngModel",
        link: function(a, d, e, f) {
          var g = ""
            , h = $("<button class='bf-spinner-increment'>&#9650;</button>")
            , i = $("<button class='bf-spinner-decrement'>&#9660;</button>");
          h.mousedown(function() {
              c(a, f, !0)
            }
          ),
            i.mousedown(function() {
                c(a, f, !1)
              }
            ),
            h.mouseup(function() {
                d.focus()
              }
            ),
            i.mouseup(function() {
                d.focus()
              }
            ),
            h.insertAfter(d),
            i.insertAfter(h),
            d.bind("focus", function(a) {
                d.select()
              }
            ),
            d.bind("keydown keypress", function(b) {
                38 === b.which ? (b.preventDefault(),
                  c(a, f, !0)) : 40 === b.which && (b.preventDefault(),
                  c(a, f, !1))
              }
            ),
            f.$parsers.push(function(a) {
                if ("" == a)
                  g = "";
                else {
                  var c = b(a);
                  if (isNaN(c) ? (f.$setViewValue(g),
                      f.$render(),
                      c = b(g)) : g = f.$viewValue,
                    !isNaN(c) && PriceLadder.isPrice(c))
                    return f.$setValidity("price", !0),
                      c
                }
                return void f.$setValidity("price", !1)
              }
            )
        }
      }
    }
  ),
  angular.module("betsim").directive("horseRunner", [function() {
    return {
      restrict: "E",
      controller: ["$scope", "$timeout", function(a, b) {
        function c(b) {
          a.data.FIRST_ANIMATION_FRAME = (b - 1) * g + 1
        }
        function d(b) {
          a.data.LAST_ANIMATION_FRAME = b * g - 1
        }
        function e(b) {
          a.data.STOP_FRAME = b * g - 1
        }
        var f = null
          , g = 8
          , h = 1.5;
        a.data = {
          FRAME_WIDTH: 100,
          FRAME_HEIGHT: 57,
          LAST_ANIMATION_FRAME: 7,
          FIRST_ANIMATION_FRAME: 1,
          AVG_SPEED: 4,
          STOP_FRAME: 8,
          MIN_POS_CHANGE: 3
        },
          this.schedule = function(c) {
            f = b(function() {
                c.setFrameDelay(a.data.AVG_SPEED);
              }
              , 1e3 * h)
          }
          ,
          this.cancel = function() {
            b.cancel(f)
          }
          ,
          this.setMainKeyframes = function(a) {
            c(a),
              e(a),
              d(a)
          }
      }
      ],
      scope: {
        horseId: "@",
        horsePosition: "@",
        horseSaddle: "@",
        horseOdd: "@",
        isHorseInMotion: "="
      },
      require: "horseRunner",
      template: '<div class="odd-tooltip"><div class="saddlecloth" ng-class="saddleClass">{{::horseSaddle}}</div><div class="odd">{{horseOdd}}</div></div><canvas width="{{data.FRAME_WIDTH}}px" height="{{data.FRAME_HEIGHT}}px"></canvas>',
      link: function(a, b, c, d) {
        var e, f = b[0].childNodes[1];
        d.setMainKeyframes(parseInt((a.horseSaddle % 8) + 1));
        var g = {
            imagePath: "assets/images/sprite-all-horses.png",
            frameWidth: a.data.FRAME_WIDTH,
            frameHeight: a.data.FRAME_HEIGHT,
            frameDelay: a.data.AVG_SPEED,
            endFrame: a.data.LAST_ANIMATION_FRAME,
            canvasElement: f,
            animStartFrame: a.data.FIRST_ANIMATION_FRAME
          }
          , h = new BF.horseRaceSimulator.Horse(g,a.data.STOP_FRAME);
        a.saddleClass = angular.isDefined(a.horseSaddle) ? "saddlecloth-" + a.horseSaddle : "",
          a.$watch("horsePosition", function(b) {
              e ? (e > b ? e - b > a.data.MIN_POS_CHANGE && (d.cancel(),
                h.increaseSpeed(),
                d.schedule(h)) : b - e > a.data.MIN_POS_CHANGE && (d.cancel(),
                h.decreaseSpeed(),
                d.schedule(h)),
                e = b) : e = b
            }
          ),
          a.$watch("isHorseInMotion", function(a, b) {
              a === !0 ? h.startAnimation() : h.isPlaying() ? h.stopAnimation() : h.gotoAndStop(0)
            }
          )
      }
    }
  }
  ]);
var exSimulator = exSimulator || {};
exSimulator.horseNames = ['Abidewithme', 'Ability', 'Adelaide', 'Admirabeel', 'Adrift', 'Agent Murphy', 'Akavoroun', 'Albonetti', 'Alkaashef', 'Almandin', 'Almodovar', 'Almoonqith', 'Aloft', 'Alpine Eagle', 'Amanpour', 'Amralah', 'Angel Gabrial', 'Araldo Junior', 'Arianne', 'Arsonist', 'Assertive Star', 'Astronomos', 'Atlantic City', 'Atlantic Road', 'Attack The Line', 'Au Revoir', 'Auvray', 'Awesome Rock', 'Baheej', 'Banca Mo', 'Bande', 'Bassett', 'Bathyrhon', 'Battle Zone', 'Beaten Up', 'Big Memory', 'Big Orange', 'Bikila', 'Black Vanquish', 'Bohemian Lily', 'BMoney', 'Bold Sniper', 'Bon Aurum', 'Bondeiger', 'Bondi Beach', 'Bonfire', 'Boom Time', 'Braccenby', 'Brigantin', 'Bring Something', 'Brockhoff', 'Brown Panther', 'Cafe Society', 'Caillebotte', 'Candelara', 'Canndal', 'Caravan Rolls On', 'Carlo Bugatti', 'Castelo', 'Celtic Prince', 'Celtic Tiger', 'Chance To Dance', 'Clondaw Warrior', 'Collaboration', 'Colonel Custer', 'Complacent', 'Contributer', 'Cosmic Cube', 'Count Of Limonade', 'Crafty Cruiser', 'Criterion', 'Curren Mirotic', 'Cylinder Beach', 'Dal Cielo', 'Dandino', 'Danuki', 'Darbadar', 'Dark Steel', 'Data Point', 'De Little Engine', 'Deadly Shadow', 'Deane Martin', 'Del Grappa', 'Delicacy', 'Deploy', 'Desert Jeuney', 'Desert Road', 'Diaghan', 'Dibayani', 'Disclaimer', 'Disposition', 'Divan', 'Don Doremo', 'Doumaran', 'Drill Master', 'Dubai Deer', 'Dubday', 'Dylans Promise', 'Eclair Attack', 'Eclair Go Go', 'El Greco', 'Elhaame', 'Emerald City', 'Epsom Hill', 'Escado', 'Ethiopia', 'Etna', 'Excess Knowledge', 'Exosphere', 'Extra Choice', 'Extra Noble', 'Faatinah', 'Falamonte', 'Fame Game', 'Famous Kid', 'Fenway', 'Fields Of Athenry', 'Fighting Storm', 'Flamingo Star', 'Flash Hero', 'Fluorescent', 'Flying Light', 'Foreteller', 'Forever Now', 'Forgotten Rules', 'Foundry', 'Four By Four', 'Francome', 'Gailo Chop', 'Gallante', 'Genuine Lad', 'Gerontius', 'Gesemi', 'Ghost Protocol', 'Glitra', 'Glorious Sinndar', 'Go Dreaming', 'Go Indy Go', 'Gold Kroner', 'Gold Symphony', 'Goldstream', 'Grand Marshal', 'Greatwood', 'Gredington', 'Guardini', 'Gust Of Wind', 'Hanas Revenge', 'Handfast', 'Happy As Hell', 'Happy Trails', 'Hartnell', 'Hauraki', 'Havana Beat', 'Havana Cooler', 'Hawkspur', 'He Or She', 'Headwater', 'Hi World', 'Hidden Gold', 'High Midnight', 'Himalaya Dream', 'Hit The Target', 'Hokko Brave', 'Holler', 'Honey Steels Gold', 'Ihtsahymn', 'Ill Take The Jag', 'Infantry', 'Inner Circle', 'Instrumentalist', 'Into The Mist', 'Intrusion', 'Invincible Knight', 'Iron Boss', 'Iteration', 'Its Somewhat', 'Ivanhowe', 'Iwauna', 'Jadeer', 'Japonisme', 'Jeewan', 'Jetset Lad', 'Jiayuguan', 'Junoob', 'Justa Hint', 'Kapour', 'Karigara', 'Keen Array', 'Kentucky Flyer', 'Kermadec', 'Kesampour', 'King Kinshasa', 'Kingdoms', 'Kingfisher', 'Kinglike', 'Kirramosa', 'Koolama Bay', 'La Amistad', 'Lady Cumquat', 'Lady Dragon', 'Lake Jackson', 'Last Bullet', 'Last Impact', 'Le Roi', 'Leebaz', 'Lets Make Adeal', 'Libran', 'Lieder', 'Light Up Manhattan', 'Like A Carousel', 'Liking The Viking', 'Lizard Island', 'Lord Van Percy', 'Loresho', 'Loyalty Man', 'Luchador', 'Lucia Valentina', 'Lunayir', 'Maastricht', 'Macavity', 'Magic Hurricane', 'Magicool', 'Magnapal', 'Mahuta', 'Man Of His Word', 'Manalapan', 'Manatee', 'Manhattan Blues', 'Manhattan Boss', 'Manndawi', 'Margin Trader', 'Master Of Arts', 'Maurus', 'Maven Wiz', 'Mawahibb', 'Max Dynamite', 'Maygrove', 'Mays Dream', 'Metallic Crown', 'Mille Et Mille', 'Minnesinger', 'Mister Impatience', 'Moher', 'Mongolian Khan', 'Montclair (IRE)', 'Monteux', 'More Than Most', 'Moriarty', 'Most Exalted', 'Most Wanted', 'Mostly', 'Mourinho', 'Mr Individual', 'Mr Optimistic', 'Multizone', 'Mutual Regard', 'Nazir', 'Nevis', 'No Tricks', 'Noble Protector', 'Observational', 'Odyssey Moon', 'One For One', 'Opinion', 'Orbec', 'Order Of St George', 'Oriental Fox', 'Our Ivanhowe', 'Paddywagon', 'Pale Mimosa', 'Palentino', 'Pallasator', 'Patch Adams', 'Pelicano', 'Pethers Moon', 'Plutocracy', 'Pondarosa Miss', 'Pop N Scotch', 'Pornichet', 'Precedence', 'Preferment', 'Press Statement', 'Pride Of Dubai', 'Prince Cheri', 'Prince Of Brooklyn', 'Prince Of Pagoda', 'Prince Of Penzance', 'Prince Tarkeida', 'Protectionist', 'Puccini', 'Puritan', 'Purple Smile', 'Quasillo', 'Quest For More', 'Ragazzo Del Corsa', 'Rageese', 'Ragnaar', 'Reach Out', 'Ready For Victory', 'Real Love', 'Realise Potential', 'Red Alto', 'Red Cadeaux', 'Redzel', 'Refectory', 'Renew', 'Republican', 'Rhythm To Spare', 'Ricky', 'Rio Perdido', 'Rising Romance', 'River Wild', 'Rock Diva', 'Romsdal', 'Royal Descent', 'Royal Diamond', 'Ruark', 'Ruling Dynasty', 'Ruscello', 'Sadlers Lake', 'San Miguel', 'San Padre', 'Santa Ana Lane', 'Sardaaj', 'Sarrasin', 'Sasenkile', 'Savaria', 'Savatone', 'Scandal Sheet', 'Scherzoso', 'Scotland', 'Scratchy Bottom', 'Sebring Sun', 'Second Step', 'Secret Number', 'Secret Prophet', 'Sense Of Occasion', 'Sertorius', 'Set Square', 'Shards', 'Shimrano', 'Shockaholic', 'Shoreham', 'Signoff', 'Silverball', 'Simenon', 'Singing', 'Sir Leliani', 'Sir Mako', 'Sir Walter Scott', 'Sky Hunter', 'Smokin Joey', 'Snoopy', 'Snow Sky', 'Some Excel', 'Sonntag', 'Sooboog', 'Soriano', 'Sovereign Nation', 'Soviet Courage', 'Spill The Beans', 'Spiritjim', 'Stellar Collision', 'Stellarized', 'Stipulate', 'Stoker', 'Stone Warrior', 'Stratum Star', 'Strike Force', 'Sun Flash', 'Surfin Safari', 'Sweynesse', 'Sysmo', 'Taaj', 'Taiyoo', 'Takedown', 'Tall Ship', 'Tally', 'Tamblyn', 'Tarquin', 'Tarzino', 'Teronado', 'The Cleaner', 'The Last Salute', 'The Offer', 'The States', 'The United States', 'The Weald', 'Thunder Lady', 'Thunder Set', 'Timikar', 'Tivaci', 'Toho Jackal', 'Tom Melbourne', 'Toruk', 'Tremec', 'Trip To Paris', 'Tristrams Sun', 'Tucano', 'Tulsa', 'Turner Bayou', 'Vanbrugh', 'Vancouver', 'Velox', 'Viceroy', 'Volkstoknbarrell', 'Wadi Al Hattawi', 'War Legend', 'Warrior Of Light', 'Weary', 'Well Sprung', 'Who Shot Thebarman', 'Wicklow Brave', 'Win Variation', 'Wind Force', 'Winning Accord', 'Winx', 'Wish Come True', 'Wudang Mountain', 'Yamz', 'Zacada', 'Zadon', 'Zafayan', 'Zanteca', 'Zarzali', 'Zayam', 'Zebrinz', 'Zee Zeely'],
  ListIterator.prototype.hasNext = function() {
    return this.ptr < this.l.length - 1
  }
  ,
  ListIterator.prototype.remove = function() {
    this.ptr >= 0 && (this.l.splice(this.ptr, 1),
      this.ptr = this.ptr - 1)
  }
  ,
  ListIterator.prototype.next = function() {
    return this.ptr = this.ptr + 1,
      this.l[this.ptr]
  }
  ,
  SortedList.prototype.insertElement = function(a) {
    var b = this.searchIdx(a);
    0 > b && this.cells.splice(-(b + 1), 0, a)
  }
  ,
  SortedList.prototype.searchIdx = function(a) {
    if (0 === this.cells.length)
      return -1;
    for (var b, c, d = 0, e = this.cells.length - 1; e >= d; )
      if (b = Math.floor((d + e) / 2),
          c = this.compare(a, this.cells[b]),
        c > 0)
        d = b + 1;
      else {
        if (!(0 > c))
          break;
        e = b - 1
      }
    return a === this.cells[b] ? b : -(d + 1)
  }
  ,
  SortedList.prototype.removeElement = function(a) {
    var b = this.searchIdx(a);
    b > 0 && this.cells.splice(b, 1)
  }
  ,
  SortedList.prototype.firstElement = function() {
    return this.cells.length > 0 ? this.cells[0] : null
  }
  ,
  SortedList.prototype.forEach = function(a, b) {
    this.cells.forEach(a, b)
  }
  ,
  SortedList.prototype.iterator = function() {
    return new ListIterator(this.cells)
  }
  ,
  SortedList.prototype.clone = function(a) {
    var b = [];
    this.cells.forEach(function(c) {
        var d = a(c);
        null  !== d && b.push(c)
      }
    );
    var c = new SortedList(this.compare);
    return c.cells = b,
      c
  }
;
var betEngineConfigurations = {
  miscellaneous: {
    labelBetween: "between",
    labelEvens: "evens"
  },
  bets: {
    oddsConversions: {
      lookupTable: [[1.01, 1, 100], [1.02, 1, 50], [1.03, 1, 33], [1.04, 1, 25], [1.05, 1, 20], [1.06, 1, 18], [1.07, 1, 14], [1.08, 1, 12], [1.09, 1, 11], [1.1, 1, 10], [1.11, 1, 9], [1.12, 1, 8], [1.13, 2, 15], [1.14, 1, 7], [1.15, 2, 13], [1.16, 2, 13], [1.17, 1, 6], [1.18, 2, 11], [1.19, 2, 11], [1.2, 1, 5], [1.21, 1, 5], [1.22, 2, 9], [1.23, 2, 9], [1.24, 1, 4], [1.25, 1, 4], [1.26, 1, 4], [1.27, 1, 4], [1.28, 2, 7], [1.29, 2, 7], [1.3, 30, 100], [1.31, 30, 100], [1.32, 1, 3], [1.33, 1, 3], [1.34, 1, 3], [1.35, 1, 3], [1.36, 4, 11], [1.37, 4, 11], [1.38, 4, 11], [1.39, 2, 5], [1.4, 2, 5], [1.41, 2, 5], [1.42, 2, 5], [1.43, 4, 9], [1.44, 4, 9], [1.45, 4, 9], [1.46, 40, 85], [1.47, 40, 85], [1.48, 40, 85], [1.49, 1, 2], [1.5, 1, 2], [1.51, 1, 2], [1.52, 8, 15], [1.53, 8, 15], [1.54, 8, 15], [1.55, 8, 15], [1.56, 4, 7], [1.57, 4, 7], [1.58, 4, 7], [1.59, 4, 7], [1.6, 8, 13], [1.61, 8, 13], [1.62, 5, 8], [1.63, 5, 8], [1.64, 5, 8], [1.65, 4, 6], [1.66, 4, 6], [1.67, 4, 6], [1.68, 4, 6], [1.69, 5, 7], [1.7, 5, 7], [1.71, 5, 7], [1.72, 8, 11], [1.73, 8, 11], [1.74, 8, 11], [1.75, 8, 11], [1.76, 8, 11], [1.77, 4, 5], [1.78, 4, 5], [1.79, 4, 5], [1.8, 4, 5], [1.81, 4, 5], [1.82, 4, 5], [1.83, 4, 5], [1.84, 5, 6], [1.85, 5, 6], [1.86, 5, 6], [1.87, 5, 6], [1.88, 10, 11], [1.89, 10, 11], [1.9, 10, 11], [1.91, 10, 11], [1.92, 10, 11], [1.93, 10, 11], [1.94, 20, 21], [1.95, 20, 21], [1.96, 20, 21], [1.97, 20, 21], [1.98, 1, 1], [1.99, 1, 1], [2, 1, 1], [2.02, 1, 1], [2.04, 21, 20], [2.06, 21, 20], [2.08, 11, 10], [2.1, 11, 10], [2.12, 11, 10], [2.14, 11, 10], [2.16, 6, 5], [2.18, 6, 5], [2.2, 6, 5], [2.22, 6, 5], [2.24, 5, 4], [2.26, 5, 4], [2.28, 5, 4], [2.3, 5, 4], [2.32, 11, 8], [2.34, 11, 8], [2.36, 11, 8], [2.38, 11, 8], [2.4, 7, 5], [2.42, 7, 5], [2.44, 7, 5], [2.46, 6, 4], [2.48, 6, 4], [2.5, 6, 4], [2.52, 6, 4], [2.54, 6, 4], [2.56, 8, 5], [2.58, 8, 5], [2.6, 8, 5], [2.62, 13, 8], [2.64, 13, 8], [2.66, 13, 8], [2.68, 13, 8], [2.7, 7, 4], [2.72, 7, 4], [2.74, 7, 4], [2.76, 7, 4], [2.78, 9, 5], [2.8, 9, 5], [2.82, 9, 5], [2.84, 15, 8], [2.86, 15, 8], [2.88, 15, 8], [2.9, 15, 8], [2.92, 15, 8], [2.94, 2, 1], [2.96, 2, 1], [2.98, 2, 1], [3, 2, 1], [3.05, 2, 1], [3.1, 85, 40], [3.15, 11, 5], [3.2, 11, 5], [3.25, 9, 4], [3.3, 9, 4], [3.35, 12, 5], [3.4, 12, 5], [3.5, 5, 2], [3.6, 13, 5], [3.7, 11, 4], [3.75, 11, 4], [3.8, 14, 5], [3.85, 14, 5], [3.95, 3, 1], [4, 3, 1], [4.2, 16, 5], [4.3, 100, 30], [4.4, 7, 2], [4.5, 7, 2], [4.6, 7, 2], [4.7, 7, 2], [4.8, 4, 1], [4.9, 4, 1], [5, 4, 1], [5.1, 4, 1], [5.2, 4, 1], [5.3, 9, 2], [5.4, 9, 2], [5.5, 9, 2], [5.6, 9, 2], [5.7, 9, 2], [5.8, 5, 1], [5.9, 5, 1], [6, 5, 1], [6.2, 5, 1], [6.4, 11, 2], [6.6, 11, 2], [6.8, 6, 1], [7, 6, 1], [7.2, 6, 1], [7.4, 13, 2], [7.6, 13, 2], [7.8, 7, 1], [8, 7, 1], [8.2, 7, 1], [8.4, 15, 2], [8.6, 15, 2], [8.8, 8, 1], [9, 8, 1], [9.2, 8, 1], [9.4, 17, 2], [9.6, 17, 2], [9.8, 9, 1], [10, 9, 1], [11, 10, 1], [12, 11, 1], [13, 12, 1], [14, 13, 1], [15, 14, 1], [16, 15, 1], [17, 16, 1], [18, 17, 1], [19, 18, 1], [20, 19, 1], [21, 20, 1], [22, 21, 1], [23, 22, 1], [24, 23, 1], [25, 24, 1], [26, 25, 1], [27, 26, 1], [28, 27, 1], [29, 28, 1], [30, 29, 1], [32, 31, 1], [34, 33, 1], [36, 35, 1], [38, 37, 1], [40, 39, 1], [42, 41, 1], [44, 43, 1], [46, 45, 1], [48, 47, 1], [50, 49, 1], [55, 54, 1], [60, 59, 1], [65, 64, 1], [70, 69, 1], [75, 74, 1], [80, 79, 1], [85, 84, 1], [90, 89, 1], [95, 94, 1], [100, 99, 1], [110, 109, 1], [120, 119, 1], [130, 129, 1], [140, 139, 1], [150, 149, 1], [160, 159, 1], [170, 169, 1], [180, 179, 1], [190, 189, 1], [200, 199, 1], [210, 209, 1], [220, 219, 1], [230, 229, 1], [240, 239, 1], [250, 249, 1], [260, 259, 1], [270, 269, 1], [280, 279, 1], [290, 289, 1], [300, 299, 1], [310, 309, 1], [320, 319, 1], [330, 329, 1], [340, 339, 1], [350, 349, 1], [360, 359, 1], [370, 369, 1], [380, 379, 1], [390, 389, 1], [400, 399, 1], [410, 409, 1], [420, 419, 1], [430, 429, 1], [440, 439, 1], [450, 449, 1], [460, 459, 1], [470, 469, 1], [480, 479, 1], [490, 489, 1], [500, 499, 1], [510, 509, 1], [520, 519, 1], [530, 529, 1], [540, 539, 1], [550, 549, 1], [560, 559, 1], [570, 569, 1], [580, 579, 1], [590, 589, 1], [600, 599, 1], [610, 609, 1], [620, 619, 1], [630, 629, 1], [640, 639, 1], [650, 649, 1], [660, 659, 1], [670, 669, 1], [680, 679, 1], [690, 689, 1], [700, 699, 1], [710, 709, 1], [720, 719, 1], [730, 729, 1], [740, 739, 1], [750, 749, 1], [760, 759, 1], [770, 769, 1], [780, 779, 1], [790, 789, 1], [800, 799, 1], [810, 809, 1], [820, 819, 1], [830, 829, 1], [840, 839, 1], [850, 849, 1], [860, 859, 1], [870, 869, 1], [880, 879, 1], [890, 889, 1], [900, 899, 1], [910, 909, 1], [920, 919, 1], [930, 929, 1], [940, 939, 1], [950, 949, 1], [960, 959, 1], [970, 969, 1], [980, 979, 1], [990, 989, 1], [1e3, 999, 1]]
    }
  }
};
MarketPosition.prototype.cancelAll = function() {
  this.market.runners.forEach(function(a) {
      a.rp.cancelAll()
    }
  )
}
  ,
  MarketPosition.prototype.recalc = function() {
    this.hasPotentialBackBets = !1,
      this.hasPotentialLayBets = !1,
      this.isPlaceable = !0,
      this.hasValidationErrors = !1,
      this.validationErrors.length = 0,
      this.market.runners.forEach(function(a) {
          a.rp.recalc(this.validationErrors),
          null  !== a.rp.potentialBackBet && (this.hasPotentialBackBets = !0,
          a.rp.potentialBackBet.isComputable() || (this.isPlaceable = !1)),
          null  != a.rp.potentialLayBet && (this.hasPotentialLayBets = !0,
          a.rp.potentialLayBet.isComputable() || (this.isPlaceable = !1))
        }
        , this),
    this.validationErrors.length > 0 && (this.hasValidationErrors = !0),
    this.hasValidationErrors && (this.isPlaceable = !1),
      this.isPlaceable = this.isPlaceable && (this.hasPotentialBackBets || this.hasPotentialLayBets);
    var a = [];
    if (this.market.runners.forEach(function(b) {
          a.push(b.rp)
        }
      ),
        a.sort(function(a, b) {
            return a.netProfit < b.netProfit ? -1 : 1
          }
        ),
        this.exposure = 0,
        a.forEach(function(a, b) {
            this.exposure += b < this.market.numWinners ? a.profitIfWin : a.profitIfLose
          }
          , this),
        !this.market.complete)
      for (var b = this.exposure, c = this.market.numWinners - 1; c >= 0; c--)
        b = b - a[c].profitIfWin + a[c].profitIfLose,
        b < this.exposure && (this.exposure = b);
    if (this.hasMatchedPosition = !1,
        this.hasMatchedLays = !1,
        this.hasMatchedBacks = !1,
        this.hasUnmatchedPosition = !1,
        this.hasUnmatchedLays = !1,
        this.hasUnmatchedBacks = !1,
        a.forEach(function(a) {
            a.hasMatchedPosition && (this.hasMatchedPosition = !0),
            a.hasMatchedLays && (this.hasMatchedLays = !0),
            a.hasMatchedBacks && (this.hasMatchedBacks = !0),
            a.hasUnmatchedPosition && (this.hasUnmatchedPosition = !0),
            a.hasUnmatchedLays && (this.hasUnmatchedLays = !0),
            a.hasUnmatchedBacks && (this.hasUnmatchedBacks = !0)
          }
          , this),
      1 === this.market.numWinners) {
      var d = 0;
      a.forEach(function(a) {
          d += a.matchedProfitIfLose
        }
      ),
        a.forEach(function(a) {
            a.netMatchedProfitIfWin = d - a.matchedProfitIfLose + a.matchedProfitIfWin
          }
        )
    }
    if (1 === this.market.numWinners) {
      var d = 0;
      a.forEach(function(a) {
          d += a.whatIfProfitIfLose
        }
      ),
        a.forEach(function(a) {
            a.netProfitIfWin = d - a.whatIfProfitIfLose + a.whatIfProfitIfWin
          }
        )
    }
    this.backBook = 0,
      this.layBook = 0,
      a.forEach(function(a) {
          this.layBook += a.layBook,
            this.backBook += a.backBook
        }
        , this)
  }
;
var RP = function(a, b) {
    this.mp = a,
      this.runner = b,
      this.profitIfWin = 0,
      this.profitIfLose = 0,
      this.whatIfProfitIfWin = 0,
      this.whatIfProfitIfLose = 0,
      this.hasMatchedPosition = !1,
      this.matchedProfitIfWin = 0,
      this.matchedProfitIfLose = 0,
      this.potentialBackBet = null ,
      this.potentialLayBet = null ,
      this.backBook = 0,
      this.layBook = 0,
      this.hasMatchedLays = !1,
      this.hasMatchedBacks = !1,
      this.hasUnmatchedLays = !1,
      this.hasUnmatchedBacks = !1,
      this.hasUnmatchedPosition = !1,
      this.matchedPayout = 0
  }
  ;
RP.prototype.cancelAll = function() {
  this.potentialBackBet = null ,
    this.potentialLayBet = null
}
  ,
  RP.prototype.addPBet = function(a, b) {
    var c = new PBet(this,a,b);
    "BACK" == a ? this.potentialBackBet = c : this.potentialLayBet = c
  }
  ,
  RP.prototype.recalc = function(a) {
    null  !== this.potentialBackBet && this.potentialBackBet.recalc(),
    null  !== this.potentialLayBet && this.potentialLayBet.recalc(),
      this.profitIfWin = 0,
      this.profitIfLose = 0,
      this.backBook = 0,
      this.layBook = 0,
      this.hasMatchedPosition = !1,
      this.matchedProfitIfWin = 0,
      this.matchedProfitIfLose = 0,
      this.hasMatchedLays = !1,
      this.hasMatchedBacks = !1,
      this.hasUnmatchedLays = !1,
      this.hasUnmatchedBacks = !1,
      this.hasUnmatchedPosition = !1,
      this.whatIfProfitIfWin = 0,
      this.whatIfProfitIfLose = 0,
      this.matchedPayout = 0,
    this.runner.unmatchedBets && this.runner.unmatchedBets.length > 0 && (this.runner.unmatchedBets.forEach(function(a) {
        "BACK" == a.side ? this.hasUnmatchedBacks = !0 : this.hasUnmatchedLays = !0
      }
      , this),
      this.hasUnmatchedPosition = !0),
    this.runner.matchedBets && this.runner.matchedBets.length > 0 && (this.runner.matchedBets.forEach(function(a) {
        this.matchedProfitIfWin += ("BACK" == a.side ? 1 : -1) * (a.price - 1) * a.size,
          this.matchedProfitIfLose += ("BACK" == a.side ? -1 : 1) * a.size,
          this.matchedPayout += ("BACK" == a.side ? -1 : 1) * a.size * a.price,
          "BACK" == a.side ? this.hasMatchedBacks = !0 : this.hasMatchedLays = !0
      }
      , this),
      this.hasMatchedPosition = !0),
      this.whatIfProfitIfWin += this.matchedProfitIfWin,
      this.whatIfProfitIfLose += this.matchedProfitIfLose,
    null  !== this.potentialBackBet && this.potentialBackBet.isComputable() && (this.profitIfWin += this.potentialBackBet.profitIfWin,
      this.profitIfLose += this.potentialBackBet.profitIfLose,
      this.whatIfProfitIfWin += this.potentialBackBet.whatIfProfitIfWin,
      this.whatIfProfitIfLose += this.potentialBackBet.whatIfProfitIfLose,
      this.backBook += 1 / this.potentialBackBet.price),
    null  !== this.potentialLayBet && this.potentialLayBet.isComputable() && (this.profitIfWin += this.potentialLayBet.profitIfWin,
      this.profitIfLose += this.potentialLayBet.profitIfLose,
      this.whatIfProfitIfWin += this.potentialLayBet.whatIfProfitIfWin,
      this.whatIfProfitIfLose += this.potentialLayBet.whatIfProfitIfLose,
      this.layBook += 1 / this.potentialLayBet.price),
      this.netProfit = this.profitIfWin - this.profitIfLose,
      null  != this.potentialBackBet && null  != this.potentialLayBet ? this.potentialBackBet.isComputable() && this.potentialLayBet.isComputable() && this.potentialBackBet.price <= this.potentialLayBet.price ? (this.potentialBackBet.hasPriceError = !0,
        this.potentialLayBet.hasPriceError = !0,
        a.push({
          type: "PRICES_CROSSED",
          bets: {
            BACK: this.potentialBackBet,
            LAY: this.potentialLayBet
          }
        })) : (this.potentialBackBet.hasPriceError = !1,
        this.potentialLayBet.hasPriceError = !1) : null  != this.potentialBackBet ? this.potentialBackBet.hasPriceError = !1 : null  != this.potentialLayBet && (this.potentialLayBet.hasPriceError = !1)
  }
  ,
  RP.prototype.remove = function(a) {
    this.potentialBackBet === a ? this.potentialBackBet = null  : this.potentialLayBet === a && (this.potentialLayBet = null )
  }
;
var PBet = function(a, b, c) {
    this.rp = a,
      this.side = b,
      this.price = c,
      this.size = NaN,
      this.profitIfWin = NaN,
      this.profitIfLose = NaN,
      this.whatIfProfitIfWin = NaN,
      this.whatIfProfitIfLose = NaN,
      this.liability = NaN,
      this.hasPriceError = !1
  }
  ;
PBet.prototype.cancel = function() {
  this.rp.remove(this)
}
  ,
  PBet.prototype.isComputable = function() {
    return this.hasPrice() && this.hasSize()
  }
  ,
  PBet.prototype.hasPrice = function() {
    return null  != this.price && !isNaN(this.price) && this.price > 0
  }
  ,
  PBet.prototype.hasSize = function() {
    return null  != this.size && !isNaN(this.size) && this.size > 0
  }
  ,
  PBet.prototype.recalc = function() {
    this.isComputable() ? "BACK" == this.side ? (this.whatIfProfitIfWin = (this.price - 1) * this.size,
      this.whatIfProfitIfLose = -this.size,
      this.profitIfWin = 0,
      this.profitIfLose = this.whatIfProfitIfLose,
      this.payout = this.price * this.size) : (this.whatIfProfitIfWin = -(this.price - 1) * this.size,
      this.whatIfProfitIfLose = this.size,
      this.profitIfWin = this.whatIfProfitIfWin,
      this.profitIfLose = 0,
      this.payout = this.price * this.size,
      this.liability = -this.whatIfProfitIfWin) : (this.profitIfWin = NaN,
      this.profitIfLose = NaN,
      this.liability = NaN,
      this.payout = NaN,
      this.whatIfProfitIfWin = NaN,
      this.whatIfProfitIfLose = NaN)
  }
;
var Matcher = function() {
    this.seq = 0,
      this.lays = new SortedList(function(a, b) {
          return a.price > b.price ? -1 : a.price < b.price ? 1 : a.id < b.id ? -1 : a.id > b.id ? 1 : 0
        }
      ),
      this.backs = new SortedList(function(a, b) {
          return a.price > b.price ? 1 : a.price < b.price ? -1 : a.id < b.id ? -1 : a.id > b.id ? 1 : 0
        }
      )
  }
  ;
Matcher.prototype.canMatch = function(a, b, c) {
  return "BACK" == c && b >= a || "LAY" == c && a >= b
}
  ,
  Matcher.prototype.opposingQueue = function(a) {
    return "BACK" == a ? this.lays : this.backs
  }
  ,
  Matcher.prototype.queue = function(a) {
    return "BACK" == a ? this.backs : this.lays
  }
  ,
  Matcher.prototype.match = function(a, b) {
    for (var c = new ListIterator(a); c.hasNext(); ) {
      var d = c.next();
      if (d.processed) {
        var e = this.opposingQueue(d.side).firstElement();
        null  != e && this.canMatch(d.price, e.price, d.side) ? (b.push({
          price: d.price,
          size: d.size,
          side: d.side
        }),
          c.remove(),
        d.price == e.price && (e.size -= d.size,
        e.size <= 0 && this.opposingQueue(d.side).removeElement(e))) : this.queue(d.side).insertElement({
          price: d.price,
          size: d.size,
          id: this.seq++,
          bet: d
        })
      }
    }
    for (c = new ListIterator(a); c.hasNext(); ) {
      var d = c.next();
      if (!d.processed) {
        for (var f = this.opposingQueue(d.side).iterator(); f.hasNext(); ) {
          var e = f.next();
          if (this.canMatch(d.price, e.price, d.side)) {
            var g = e.price
              , h = Math.min(e.size, d.size);
            if (d.size -= h,
                e.size -= h,
                b.push({
                  price: g,
                  size: h,
                  side: d.side
                }),
              e.bet && (e.bet.size -= h,
                b.push({
                  price: g,
                  size: h,
                  side: e.bet.side
                })),
              0 == e.size && f.remove(),
              0 == d.size) {
              c.remove();
              break
            }
          }
        }
        d.processed = !0,
        d.size > 0 && this.queue(d.side).insertElement({
          price: d.price,
          size: d.size,
          id: this.seq++,
          bet: d
        })
      }
    }
    for (c = new ListIterator(a); c.hasNext(); ) {
      var d = c.next();
      d.size <= 0 && c.remove()
    }
  }
  ,
  Matcher.prototype.setup = function(a, b, c) {
    var d = {}
      , e = {};
    c.forEach(function(a) {
        "BACK" == a.side ? d[a.price] ? d[a.price] += a.size : d[a.price] = a.size : e[a.price] ? e[a.price] += a.size : e[a.price] = a.size
      }
    ),
      a.forEach(function(a) {
          var b = a.size;
          d[a.price] && (b -= d[a.price]),
          b > 0 && this.queue("LAY").insertElement({
            price: a.price,
            size: b,
            id: this.seq++
          })
        }
        , this),
      b.forEach(function(a) {
          var b = a.size;
          e[a.price] && (b -= e[a.price]),
          b > 0 && this.queue("BACK").insertElement({
            price: a.price,
            size: b,
            id: this.seq++
          })
        }
        , this)
  }
  ,
  Matcher.prototype.applyView = function(a, b) {
    for (var c = a.iterator(), d = [], e = null , f = null ; c.hasNext(); ) {
      var g = c.next();
      if (null  == e)
        e = g.price,
          f = g.size;
      else if (e == g.price)
        f += g.size;
      else if (e != g.price) {
        if (d.push({
            price: e,
            size: f
          }),
          3 == d.length)
          break;
        e = g.price,
          f = g.size
      }
    }
    d.length < 3 && d.push({
      price: e,
      size: f
    });
    for (var c = 0; 3 > c; c++) {
      this.cellChanged(b[c], d[c]);
      d[c] && (d[c].changed = !b[c] || (b[c].price !== d[c].price));

      b[c] = d[c];
    }
  }
  ,
  Matcher.prototype.cellChanged = function(a, b) {
    return null  == a && null  != b || null  != a && null  == b || null  != a && null  != b && (a.price != b.price || a.size != b.size)
  }
  ,
  Matcher.prototype.execute = function(a, b, c, d, e, f) {
    this.setup(a, b, c),
      this.match(d, c),
      this.applyView(this.backs, f),
      this.applyView(this.lays, e)
  }
;
var PriceLadder = {
    prices: [],
    maxPrice: 1e3,
    minPrice: 1.01,
    init: function() {
      for (var a = 101; 1e5 >= a; )
        this.prices.push(a / 100),
          a >= 1e4 ? a += 1e3 : a >= 5e3 ? a += 500 : a >= 3e3 ? a += 200 : a >= 2e3 ? a += 100 : a >= 1e3 ? a += 50 : a >= 600 ? a += 20 : a >= 400 ? a += 10 : a >= 300 ? a += 5 : a >= 200 ? a += 2 : a >= 100 && (a += 1);
      return this
    },
    isPrice: function(a) {
      return void 0 !== a && a ? this.priceIndex(a) >= 0 : !1
    },
    nudge: function(a, b) {
      var c = this.priceIndex(a);
      return c >= 0 ? this.prices[this.bounds(c + (b ? 1 : -1))] : (c = -c - 1,
        this.prices[this.bounds(c + (b ? 0 : -1))])
    },
    bounds: function(a) {
      return 0 > a ? 0 : a > this.prices.length - 1 ? this.prices.length - 1 : a
    },
    priceIndex: function(a) {
      for (var b, c = 0, d = this.prices.length; d >= c; )
        if (b = Math.floor((c + d) / 2),
          a > this.prices[b])
          c = b + 1;
        else {
          if (!(a < this.prices[b]))
            break;
          d = b - 1
        }
      return a == this.prices[b] ? b : -(c + 1)
    }
  }.init()
  , exSimulator = exSimulator || {};
exSimulator.prices = [1.01, 1.02, 1.03, 1.04, 1.05, 1.06, 1.07, 1.08, 1.09, 1.1, 1.11, 1.12, 1.13, 1.14, 1.15, 1.16, 1.17, 1.18, 1.19, 1.2, 1.21, 1.22, 1.23, 1.24, 1.25, 1.26, 1.27, 1.28, 1.29, 1.3, 1.31, 1.32, 1.33, 1.34, 1.35, 1.36, 1.37, 1.38, 1.39, 1.4, 1.41, 1.42, 1.43, 1.44, 1.45, 1.46, 1.47, 1.48, 1.49, 1.5, 1.51, 1.52, 1.53, 1.54, 1.55, 1.56, 1.57, 1.58, 1.59, 1.6, 1.61, 1.62, 1.63, 1.64, 1.65, 1.66, 1.67, 1.68, 1.69, 1.7, 1.71, 1.72, 1.73, 1.74, 1.75, 1.76, 1.77, 1.78, 1.79, 1.8, 1.81, 1.82, 1.83, 1.84, 1.85, 1.86, 1.87, 1.88, 1.89, 1.9, 1.91, 1.92, 1.93, 1.94, 1.95, 1.96, 1.97, 1.98, 1.99, 2, 2.02, 2.04, 2.06, 2.08, 2.1, 2.12, 2.14, 2.16, 2.18, 2.2, 2.22, 2.24, 2.26, 2.28, 2.3, 2.32, 2.34, 2.36, 2.38, 2.4, 2.42, 2.44, 2.46, 2.48, 2.5, 2.52, 2.54, 2.56, 2.58, 2.6, 2.62, 2.64, 2.66, 2.68, 2.7, 2.72, 2.74, 2.76, 2.78, 2.8, 2.82, 2.84, 2.86, 2.88, 2.9, 2.92, 2.94, 2.96, 2.98, 3, 3.05, 3.1, 3.15, 3.2, 3.25, 3.3, 3.35, 3.4, 3.45, 3.5, 3.55, 3.6, 3.65, 3.7, 3.75, 3.8, 3.85, 3.9, 3.95, 4, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 5, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 6, 6.2, 6.4, 6.6, 6.8, 7, 7.2, 7.4, 7.6, 7.8, 8, 8.2, 8.4, 8.6, 8.8, 9, 9.2, 9.4, 9.6, 9.8, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450, 460, 470, 480, 490, 500, 510, 520, 530, 540, 550, 560, 570, 580, 590, 600, 610, 620, 630, 640, 650, 660, 670, 680, 690, 700, 710, 720, 730, 740, 750, 760, 770, 780, 790, 800, 810, 820, 830, 840, 850, 860, 870, 880, 890, 900, 910, 920, 930, 940, 950, 960, 970, 980, 990, 1e3];
