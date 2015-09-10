/*! Build 297 - 2015-07-22, 15:14 */
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
  null  === raceList ? loadRaceList(a) : loadMarket(a)
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
        a.execute(this._atb, this._atl, this.matchedBets, this.unmatchedBets, this.atb, this.atl)
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
    loadRace(function(b) {
        var raceLengths = [1000, 1200, 1400, 1700, 1800, 2200, 2800];
        a.market = b,
          a.market.distance = (b.iterator.l || []).filter(function(point) {
            return point.state === 'INPLAY';
          }).length,
          console.log(a.market.distance),
          o(),
          a.$apply()
      }
    )
  }
  function e(b) {
    a.playing && a.market.next(),
      n(),
    b || a.$apply(),
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
      return a.playing || h()
    }
    ,
    a.isBtnPauseDisabled = function() {
      return !a.playing || h()
    }
    ,
    a.isBtnSkipToStartDisabled = function() {
      return h() || g()
    }
    ,
    a.isBtnSkipToEndDisabled = function() {
      return h() || !g()
    }
    ,
    a.restart = function() {
      a.playing = !1,
        a.isEnvInMotion = !1,
        a.isHorseInMotion = !1,
        a.started = !1,
        a.betslipState = "PLACE",
        a.stallPosition = 88,
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
exSimulator.horseNames = ["A Baby Maybe", "A Chance Mating", "A Day Latte", "A Dolt Supervision", "A Freud to Find Out", "Abby Joseph Cohen", "Abettor Mouse", "Abigail Force", "Abnegator", "Above and Abettor", "Absalom", "Abundance Grand", "Acacia Saint", "Acacian Spring", "Acapulco Gold", "Accolady", "Achilles Kiwi", "Acid Rein", "Acorn Palace", "Active Radio", "Ad Liberace", "Adam Fathom", "Adorn Scorn", "Adornica", "Adventure Camping", "Adventure Capitalism", "Advertis Miss", "Advice Squad", "Aecium", "Aesthetic Bug", "Aesthetic Ruin", "Affluential", "Agenda to Boot", "Agent Botox", "Agent Duh", "Agent Flow", "Aggregutter", "Aglaya", "Agoura Phobia", "Agriox", "Airborne Pickle", "Airvoyance", "Akimbo", "Al Bum", "Al Fresco", "Al Fresco’s", "Al Indigo", "Al Kremlin", "Al Mortal", "Al Niño", "Al Pay U. Later", "Al Told", "Alan Off", "Albeit George", "All Indigo", "Allen’s Woody", "Alpha Mail", "Alpha Mail Order", "Alpha Mall", "Alpha Mile", "Alpha Miles", "Altraeon", "Amagansett Am I", "Amagansett Go Around", "Amalgamate", "Amanda Marigold", "Amelia Rate", "American Whey", "Ample Trample", "Amy Sanguine", "Anacho", "Anadroze", "Anavenetro", "Anchors Astray", "Andershun", "Andy Brand", "Anecdotal Science", "Anger Angel", "Angryman", "Angus O’Reilly", "Anivet", "Anixang", "Antimatter", "Any Luck?", "Apothecarney", "Appear to Appear", "Appy Planet", "Aqua Duck", "Aquacine", "Aquafire", "AquaQleen", "Aquasseur", "Aquazure", "Aquicin", "Aquoavo", "Arboreal Trumpet", "Argggggghhhhhhh", "Arianna", "Arise and Shinola", "Arkansassy", "Arley Bouticher", "Armor Ollie", "Arotiaka", "Artego", "Article of Clothing", "Articular Matters", "ASAP", "Ass Texas", "Astrology", "Asymilate", "Atilla Mockingbird", "Atom Smasher", "Atomic Conch", "Atomic Donut", "Attila the Bunny", "Attila the Humm", "Attila The Hunk", "Auntie Freeze", "Aural Six", "Auto Bon Bons", "Avenetro", "Azurefire", "Baba Baba", "Baba Blongata", "Baba Ghanouj", "Baba Rum", "Babblegate", "Babylon Cheyney", "Bacon Jack", "Bad Rabbit", "Bag of Courage", "Bait Bait Bait", "Bakery", "Balancing Action", "Bali Who", "Ball Lightning", "Balmy Steve", "Bamboo Gnu", "Bamboolong", "Banana Cabana", "Bandwidth", "Bandwithout", "Banned", "Bapoon", "Bar Flight", "Bard’s Bench", "Barnaby Jesus", "Barnacle Power", "Barney", "Barton Brigadier", "Basil Bromide", "Basking Bingo", "Bates", "BB Lutz", "Be My Trotsky", "Bean Countess", "Beanie Boyd", "Bear Trope", "bEarth", "Beauteous Maximus", "Beauty Call", "Beaver’s Bend", "Bébé Boom", "Bee Kindling", "Bee Salt", "Bee Saw", "Beef Patrol", "Beef Storm", "Beefbelly", "Before Breakfast", "Before Coffee", "Beg", "Beige and Briney", "Bela Bite", "Belagossi", "Belfaster", "Bella Figala", "Below the Beltway", "Beluga", "Beluga Bandit", "Beluga Banjo", "Beluga Oblongata", "Benephisto", "Best Defense", "Besto", "Better Than Money", "Bible Quest", "Bid and Ask", "Big Bother", "Big Juicy", "Big Mother", "Big Nico", "Big Potato", "Bigdude", "BigWay", "Billy Billy", "Billy Billy’s Boy", "Biloxi Calm", "Biloxi Force", "Bingo Binge", "Bingo Bingo", "Bingo Tinge", "Bird Casting", "Bitter Herb", "Bitter Plaid", "Bitterbug", "Biz", "Black Belt Barbie", "Black November", "Blairvado", "Blanch DuPont", "Blanche France", "Blando", "Blanet", "Bleendot", "Blind Wally", "Blog a Thong", "Blongata Sunrise", "Blow the Dough", "Blown by Bits", "Blow-up Rights", "Blue Ball", "Blue Horizon", "Bluez", "Blur Planet", "Bob Cratchett", "Bob Granite", "Bob Mutton", "Bob Steps Out", "Boca Constrictor", "Bocca Bot", "Bodega Baby", "Boilcat", "Boilhead", "Bolinas", "Bolinas Oil", "Bolt Colt", "Bolt Cult", "Bolto", "Bolton Rash", "Boltonic", "Bon Chovy", "Bone Free", "Bonedad", "Bonefly", "Bonus Slice", "Book Bound", "Booster Cake", "Bora Bora Boar Hunt", "Born Lucky", "Born to Scrum", "Bostonic", "Botox Detox", "Botoxic", "Botoxicating", "Botoxidermy", "Bovain", "Bovine Vanity", "Box ‘O Guru", "Brag a Tear", "Brain Butter", "Brain Marrow", "Bran Dandy", "Brand New Larry", "Brass Tactics", "Bravomissimo", "Brazen Raisin", "Break a Leg", "Break the Clocks", "Brew Toil", "Brewed Attitude", "Brig-a-Doom", "Bring it!", "Bristol Diamond", "British Miss", "Broadway Baggins", "Broadway Chez", "Broadway Czar", "Broadway Dorian", "Broadway Etiquette", "Broadway Façade", "Broadway Imperative", "Broadway Sanguine", "Broadway Trotsky", "Broken Auntie", "Broker Puff", "Bronte Thesaurus", "BronteSaurus", "Bronze Cheese", "Brood Storm", "Broom Bunt", "Brown Nose Derby", "Brunchability", "Brunchilli", "Brunchilli Sunrise", "Bubboil", "Buckley", "Buddha Bait", "Buddha Bite", "Buddha Loops", "Buddhist Pest", "Buffalo Roman", "Bug Biter", "Bug Gloss", "Bugabug", "Bull Throttle", "Bullhorn", "Bunga Ding Dang", "Bungee Bottom", "Burl", "Burl Baby Burl", "Burl Lancaster", "Burl Ocea", "Burl Whirl", "Burlicious", "Burn It On!", "Burning Sand", "Busta Buddha", "Buster Boon", "Buster Keaton", "Butane Jane", "Butt Mumble", "Butter and Grace", "Butyl Full", "Buy The Way", "Buzz Kilt", "Buzz Skill", "Buzzopia", "Bytrex", "Cadillack", "Cadillackey", "Caffeine", "Caffeine Serene", "Cajun Sation", "Cajun-Sation", "Call it Green", "Call Randy", "Calyfornia", "Camelabra", "Campaign Daddy", "Campoignant", "Canadiaunt", "Candide Consulting", "Candide Opal", "Candlelight Virgil", "Candy Ask", "Cannery Row", "Canopoly", "Can’t Elope", "Can’t Elope, Honey Do…", "Cantor Bury", "Cap Happy", "Captain Bamboo", "Captain May I", "Captain Runaway", "Captain Zip", "Captainstance", "Carbon Dating", "Cardio Radio", "Carma Supra", "Carnal Logic", "Carnal Sanders", "Carnegie Hall", "Carnival Knowledge", "Carson", "Casa de Botox", "Casa de Noche", "Casa Mañana", "Cascadence", "Cash Cow", "Castillos de Calm", "Castro Infidel", "Casuwalt", "Casuwalter", "Category Foreplay", "Catfight", "Celery Dreams", "Celestial Pudding", "Censor Ship", "Censortium", "Center Marigold", "Center Sanchica", "Centigrand", "Cerki", "Chain Cheney", "Chancellor", "Chapter 12", "Chapter Elvis", "Chateau Low-blow", "Chateau Yo", "Chaucer’s Choice", "Cheap Financial Officer", "Cheek", "Cheeky", "Cheese by DuPont", "Cheese Panic", "Cheesy Chopin", "Cheeze Panic", "Chemical Nosedive", "Chen On Soso", "Cheney Chain", "Chenon So So", "Cher If", "Chernobyl", "Cherry Asphalt", "Cherry Fodder", "Chez Kicks", "Chez Maggie", "Chez Moi", "Chez Naïveté", "Chez Too", "Chez Toupee", "Chief Saskitune", "Chillinnium", "Chinatownhouse", "Chipotle Power", "Chips and Guac", "ChitterChatter", "Choco Lulu", "Chokey Cheese", "Chompsky", "Chomsky", "Choo Choo", "Choot", "Chop Chop", "Chow Biscuit", "Christian Cuisine", "Chuck Driver", "Chuck the Wagon", "Chuggin the Baba", "Chum", "Chumb", "Chutney Love", "Ciao Buddha", "Ciao, Bella Figala", "Ciàobama", "Cinaster", "Cinco Volvo’s", "Cincyr", "Cinesanct", "Circa Fast", "Circuitship", "Circum", "Circumstantialist", "Civil Libation", "Clarko", "Class Wire", "Clever Leather", "Click Fraud McGraw", "Clickstorm", "Climox", "Clive", "Clone Clown", "Clone Tone", "Clone Your Own", "Clones R Us", "Closet Palace", "Closet Santa", "Clover Dale", "Clover Deuce", "Clovis", "Clown School", "Club Medic", "Clutch", "Coal Oil Point", "Coash", "Cobalt", "Cobalt Lightening", "Cobean", "Cockney Sucker", "Cockroach Clout", "Cockroach Perfect", "Cockroach Survival", "Cocoa Clasp", "Cod", "Codger Quest", "Codrail", "Coffee Conundrum", "Coffee School", "Coffee’s Ready!", "Coil Your Jets", "Colonel Spike", "Colt Bolt", "Columbo Logic", "Combath", "Comcentric", "Comdo", "Come Heir", "Comelet", "Comgo", "Comlooker", "Communicate This!", "Comnivorous", "Comp Lament", "Complex Oedipal", "Complimentia", "Computo", "Comrush", "Comup", "Con Grace", "Con Science", "Condimench", "Confection Detection", "Confetti Logic", "Confiture Demure", "Confucius", "Confusion Seis", "Constance Cognoscenti", "Constant Coffee", "Constant Comment", "Constant Coy", "Constant Planck", "Constant Plank", "Contain Her", "Contessa Confessa", "Continent 7", "Continuity", "Continuous", "Continuous Bison", "Continuous Screed", "Contrary Beauty", "Conundreampt", "Conundrum", "Conundrum Bum", "Conundrum Grand", "Conundrum Judy", "Conundrummer", "Conundrummer Boy", "Conundrunk", "Convict", "Cook Bookie", "Cook the Books", "Cookie Book", "Cookie Bookie", "Cookie Butter", "Cool Tofu", "Cool Torque", "Copabull", "Copywrong", "Corepan", "Corey Flintoff", "Corn Dog Social", "Corndog", "Coronal Massage", "Corporal Tunnel", "Cosmetallic", "Cosmic Church", "Cosmic Cocoon", "Cosmic Crunch", "Cosmic Fish", "Cosmic Saint", "Cosmo Not", "Costume Base", "Cotatti Logic", "Could Be Worse", "Counter Clone", "Counter Coutier", "Counter Coy", "Coupe de Troupe", "Courtesy Ovation", "Cowboy Bob Santa", "Cowboy Logic", "Crabkitten", "Cranky Petunia", "Crassabout", "Crazy Matrix", "Cream Sweep", "Crew Goo Goo", "Cricket Ticket", "Critical Pig", "Crotch Jockey", "Croutonium", "Crowd Daddy", "Cruel Banana", "Crush Station", "Crustacean Prince", "Cruton", "Crüton Bomb", "Crutos", "Crux O’ the Matter", "Cruxter", "Cubicide", "Cubicle Machine", "Cubicoil", "Cult Order", "Cultural Divot", "Culture Dip", "Culture Mole", "Cupcake", "Cut Fastball", "Cutie Cult", "Cutter", "Cutter Claw", "Cuzzles", "Cycle Suave", "Cyra-no-no", "Czar Donic", "D. E. Light", "D.E. Lightful", "Dacron Dave", "Dada Data", "Dada Dwiddle", "Daddy Now", "Dag Nabbit", "Dagwood Dreams", "Dagwood Fears", "Dahmer Pass", "Dairy Anne", "Damagansett", "Dan Dorfman", "Dan the Torpedoes", "Dandit", "Dandy Layne", "Dare Demeanor", "Darling Particle", "Darvane", "Darwanton", "Darwendy", "Darwin 911", "Darwin Again", "Darwin Darlose", "Darwin Sum", "Dar-Win-Again", "Darwinium", "Darwin’s Lagoon", "Darwinter", "David Chastity", "Deal Light", "Dearlescent", "Deb You Taunt", "Debut Taunt", "Debutaunt", "Deep Blue Scene", "Deep Blue See", "Deep C", "Deep Issue", "Defacto Princess", "Del Mar Dutch", "Delicatessen Style", "Deliveranch", "Deluth", "Deminimum", "Demo Lotion", "Denim Minimum", "Deputy Debutante", "Deucebra", "Devil Music", "Devilette", "Deviltoe", "Deviltrope", "Dew Diligence", "Diabolique", "Dialogue", "Diamantra", "Diamond Sky", "Diatribe", "Didantic", "Die Laughing", "Diet Smokes", "Digifad", "Digital Jones", "Dijon Bomb", "Dilbertio", "Dilitaunt", "Dim Summit", "Dirty Laundry", "Discerning Ted", "Disco Tootsie", "Discretion", "Distinctive Arms", "Divinitease", "Doc Herr Chicago", "Doc Hollandaise", "Doc Mantra", "Doctor Sloth", "Dog Philosophy", "Doggy Biscotti", "Dogma Beware", "Dolcinea Interlude", "Dolcinea Ladybird", "Dole Troll", "Dole Your Own", "Dollar Llama", "Dom Delki Voodoo", "Domino Debt", "Donnerdom", "Donut God", "Dos Pagans", "Dostoevsky", "Dot Calm", "Dot Candy", "Dot Com Car", "Dot Compadre", "Dot Connie", "Dot Dog", "Dot Don", "Dot Dottie", "Dot Down and Out", "Dot Downtown", "Dote", "Double Beige", "Double Dada", "Double Felix", "Double Happiness", "Double Jesus", "Double Taurus", "Doubtlaw", "Dove Dude", "Dove Punch", "Downwind Dogs", "Dr. Boring", "Dr. Boyle", "Dr. Burl", "Dr. Contessa", "Dr. Equal", "Dr. Fangold", "Dr. Fusspot", "Dr. Gerbils", "Dr. Goodfunk", "Dr. Grout", "Dr. Haste", "Dr. Know", "Dr. Loop", "Dr. Lov", "Dr. Mantra", "Dr. Mood", "Dr. Moody", "Dr. No", "Dr. Pain", "Dr. Pang", "Dr. Pangloss", "Dr. Perish", "Dr. Princess", "Dr. Prudent", "Dr. Rumi", "Dr. Sorensen", "Dr. Successor", "Dr. Tirade", "Dr. Vegan", "Dr. Win", "Dr. Zeus", "Drag Racy", "Dragon Sooth", "Drama Mine", "Drama Trama", "Dramantra", "Drastic Plastic", "Dream Fire", "Dream Pavement", "Dream Trotter", "Driftwoody", "Drill Pill", "D-Troop", "Dude Quark", "Duke Wellington", "Dune Drone", "Dung Beetle", "Dusty Jewel", "Dusty Rainbow", "Dutch Oven Gretel", "Dwealth", "Dynamantra", "e Me Up Scotty", "E.L.O. Quaint", "Ear Scorn", "Eargo", "Earth Cup", "Earth Kit", "Earth to Earth", "Eartha Kitt", "Earthmark", "Earthscope", "Easy Seed", "EBIT Dada", "EC Rises", "Eccentrifugal", "Echo Shack", "Ecliplicant", "Eclipsent", "Eclipto", "Egypto", "El Dainty", "Electric Waffle", "Electrolance", "Elemantra", "Elemaunt", "Elephanturi", "Eligible Golddiggers", "Elita", "Elpro", "Elvis Othello", "eMantis", "Emboldened", "Emergent", "Emily LeBronte", "Eminiece", "Emo Pigeon", "Emoltra", "Empire’s R Us", "Empirica", "Empirical Dana", "End Council", "Enervate", "Enigma on Rye", "Enormo", "Enrondezvous", "Enterprise Fighter", "EnTrona", "Enzo", "Epilogue", "Eplode", "Epoch Collapse", "Equity", "Erie Coincidence", "Eros", "Erstwhile", "Escargot", "Eschew Crew", "Estate of Affairs", "eTarious", "Eternity Waltz", "Event You All", "Everzebra", "Eve’s Dropping", "EviDance", "Evidends", "Evidentiary Express", "Ex Existential", "Excrutio", "Executive Host", "Exerta", "Exhibit A", "Exiand", "Existential Nudge", "Existential X", "Exit Matter", "Exit Tangential", "Exo Eccentric", "Exoblue", "ExoMonk", "ExoPlanet", "Exospeed", "ExoStorm", "ExoTrek", "Exoville", "Expecting Saratoga", "Extro", "Exuberanch", "Eye Handy", "Fabricate", "Fabriquat", "Fabulous Faux", "Fair Moan", "Faire Moan", "Fallout", "Fanarina", "Fanatastic", "Fanfare", "Fangold", "Far Away Feast", "Far Horizons", "Farmer’s Almanac", "Fast and Furious", "Faster Disaster", "Father Earth", "FatJet", "Faux Boil", "Faux Certain", "Faux Fabulous", "Faux Fax", "Faux Fire", "Faux Fum", "Faux More Years", "Faux Pa", "Faux Phox", "Faux the Money", "Faux the Show", "Faux Ward", "Fauxlita", "Fax to London", "Fear Cure", "Fear Cut", "Fear Fire", "Fear Foil", "Fear Tumbler", "Feather Lace", "Featherbaby", "Fed Candy", "Feelings", "Feliner", "Feral Merrill", "Few Chore", "Fez", "Fi Fi Faux", "Fi Fi Faux Fum", "Fickle Finger", "Fickle Tickle", "Fiddler’s Fig", "Fill the GAAP", "Final Consumption", "Finishing School", "Finsta Guana", "Fire Floss", "Fire Friendly", "Fire Monk", "Fire Sippin’", "Fire Strom", "Fire Waldo", "Fire Waltz", "Firefly Friends", "Firelight Forge", "Firenze", "Firewax", "First and For Most", "First Place Haste", "First Snow", "Fitzcaraldo", "Five Bubbies", "Five O’clock Shadow", "Fix n’ Vix", "Fixed End Fodder", "FixerUpper", "Fixin’ Vixen", "Flag Hag", "Flagrant Fish", "Flagrant Miss", "Flambo", "Flame-Thrower", "Fleetmix", "Flesh Pond", "Fleshpot", "Flew Z", "Flight Risk", "Flogged Rocket", "Flop Star", "Floppy Zinger", "Flora Fiona", "Floss and a Prayer", "Flossing Heidi", "Flost", "Flotilla the Hun", "Flotsam Johnny", "FlotSam’s Club", "Flovinzen", "Flowing Ancient", "Flush Drawn", "Fly Butter", "Flybar", "Flying Chaucer", "Flying Edge", "Flying Fracas", "Flying Gravity", "Flying Horse", "Flying Marsius", "Flying Monk", "FlyingFog", "Flypaper", "Fo Lita", "Focus Face", "Fodder Phobe", "Fog Blob", "Foil Force", "Folk Smog", "Fondue Freeze", "Fonzi Scheme", "Foo", "Food Storm", "Fool ‘Em – Rule ‘Em", "Fool Flavor", "Foolio", "Fooly Valued", "For Allah’s Sock", "Forestville", "Forever Blonde", "Forgive and Forfeit", "Fork Left", "For-Moolah", "Fornacain’t", "Fornican’t", "Fort Angus", "Forte Foray", "Fortean Chef", "Fortean Event", "Fortyfied", "Four Seed Sons", "Fox Faux", "Foxy by Proxy", "Foxy Moron", "Fractions", "Fragrant Flagrant", "Fragrant Miss", "Fran Scene", "Franscene", "Fray Ray", "Frazzy Grainger", "Freakin", "Freakin Beacon", "Freakin’ Out", "Free of Science", "Free Ranger", "Free the Bees", "Freedom Friar", "Freetoad", "Freezer Burn", "French Horn", "French Lizard", "French Poodle", "French Wedding", "Freon", "Fresh Frenzy", "Freshest", "Freud", "Freudian Slipper", "Freudian Slippers", "Friendly Fire", "Frolic Acid", "Frolique", "Frothy Logic", "Fryar Tuck", "Fuel for Thought", "Full Moon Kathy", "Functional Freak", "Funky Butter", "Furnichorizo", "Future Finder", "Future Tab", "Future This!", "Fuzzy Logic", "Fuzzy Lozenge", "G2-También", "Gage and Desoto", "Gal Van Nuys", "Galveston Eye", "Game Face Jesus", "Garden Variety", "Gee Spotty", "Gellopax", "Gems for Jesus", "Generation Botox", "Generation Jane", "Generation Zero", "Genome", "Gensana", "Gentle Dental", "GeoDash", "Gestalt", "Giant Bob", "Giant Path", "Gig Digit", "Gincoba", "Ginger Snapping", "Ginger Vitro", "Gingerbread Ban", "Girl Parts", "Girltawk", "Give ‘em Lip", "Gizord", "Glace Lass", "Glamour and Glitz", "Glaswegian", "Gleamer", "Glendale Evans", "Gliding Light", "Globo Sphere", "Globoil", "Glossy Trotsky", "Glow Wonder", "Glow Your Own", "Glucktor", "Glue Belly", "Glum", "Gnome Clone", "Go for the Juggler", "Go Ned!", "Go with Know", "God I’ll Be Mighty", "Golistic", "Gology", "Good Woody", "Googoily", "Googoyle", "Goon Boon", "Goon Cocoon", "Goosebump Factor", "Gorad", "Gorganic", "Gorge Us", "GorillaTwenty", "GoTee", "GoYenGo", "Grain Oil Ya", "Grainspot", "Gram Are", "Grammburglar", "Grand Indifference", "Grand Scale", "Granite Planet", "Granny’s Fanny", "Grassmasher", "Gray Bar", "Great Conductor", "Great Uncle Bulgaria", "Green Exit", "Green Eyed Larry", "Green Gravity", "Green Louie", "Green Mole", "Greenspan", "Green-T", "Gregor Samsa", "Grill", "Grill to Chill", "Grimley", "Gristle Epistle", "Grizzled Heights", "Groenig", "Groove Thang", "Groove Thong", "Grovert", "Grupoli", "Guak", "Guernica", "Gumby Logic", "Gumby’s Choice", "Guru", "Guru Cricket", "Guru Hopper", "Guru Logic", "Guru Smile", "Guru Static", "Guru Sum", "Guru To Go", "Guru To-do", "Guru Too", "Guru-to-do", "Gush Cool", "Gwyneth", "Habit Taught", "Habitual Church", "Hactor", "Haiku Harry", "Hair Looms", "Hair Peace", "Hair Test", "Halap", "Halcyon Arms", "Half Full", "Hall and Oates", "Hallo Hollow", "Ham Licker", "Hambone", "Hambone Martian", "Handit Bandit", "Hanky Pancreas", "Happenstance", "Happy Accident", "Harbin Jour", "Harbinger Clive", "Hardy-har-har-able", "Harkvark", "Harmonica Lewinsky", "Harness the Fury", "Harr D.", "Harry Carry", "Hastee", "Hasten", "Hate the Boss", "Have Full", "Hawt Nawt", "Head and Toe Purple", "Headwind", "Hearts of Palm Inc.", "Heat Wave Goodbye", "Heaven Forbid", "Hegemony", "Hegemony Honey", "Heidi Heist", "Heir Bag", "Heir of the Dog", "Helena Handbasket", "Helium", "Helixer", "Hell Lodi Kitty", "Hell Toupee", "Hello Lita", "Helmutt", "HeLo Lita", "Hemi More", "Hemline of Fire", "Herbal Underground", "HERD Research", "Here 24", "Here Comes Me", "Herniated Disco", "Hester Bereft", "Hester Prickpin", "Hester Pure", "Hetrex", "Hey Buddha!", "Hey Low", "Hi Que", "High and Monty", "High Country", "High Coup", "High Octane Council", "High School Fed", "High Seas Postal", "High Street Modern", "High Tee", "High Voltaire", "HighTee", "Hiku", "Hill Bully", "Hillbilly Riviera", "Hinckley", "Hip No Therapy", "HipHop Hooray", "Hipping Boy", "Historia Fonz", "Ho Ho Hoist", "Hobgoblin’s Hat", "Hobo Satan", "Hobo Zo", "Hog Fog", "Hog Oscar", "Hold the Malaise", "Holy Sauce", "Home Onerous", "Homeroom Cafe", "Hoodie", "Hooray Fay", "Hop Along Chastity", "Hopalong Cheney", "Horizon Sky", "Hornery", "Horpor", "Horrid Crab", "Horse Code", "Horsezilla", "Hot Dogma", "Hot Geology!", "Hot Kafka!", "Hot Magma!", "Hot Pot", "Hot Schenectady", "Hot Sour and Soar", "Hot Trotsky", "Hotrod Logic", "Hover Crank", "Hue Bris", "Huffington Heights", "Humblood", "Hummer Bummer", "Humvegan", "Hungry Head", "Hunk Junkie", "Hunky Hurry", "Hunters Gathering", "Hurrikeynesian", "I Gotta Have It.", "I Wood Knot No", "Icarus", "Icarus Not", "Ice Crush", "Ice Floe Baby", "IceBird", "Idego", "Ignition to Mars", "Ignore Ants", "Igoraphobia", "Illumity", "Illustrioso", "Illustrious Oh", "Imagine Maggie", "Imperative", "Imperial Fire", "Imprecious", "In Ovation", "In Ovation Station", "Inbox", "Indian Summer", "Indigestion Jesus", "Inducing Introducing", "Industry Magnet", "inFire", "Info Mutiny", "Information Aged", "Inhabitaunt", "inHeat", "Inspect Greatness", "Inspiracy", "Inspiration Hat", "Inspire Choir", "Integres", "Intergnat", "Interknack", "Internet Bubbly", "Internet Eternity", "Internet Police", "Invest in Mints", "Iowa Sailor", "IQ-U", "Irascible Savvy", "Iron Horace", "Irreversible Optimism", "Irreversible Order", "Irvine Grind", "Irvine Wallet", "IsoMatrix", "IsoMonk", "IsoTrek", "It Takes an Iceberg", "Ithacan Do", "It’s in the Bank", "Ivan Biloxi", "Ivridse", "Izzy Bell", "Jack Addict", "Jack Swayed", "Jack the River", "Jacket Straight", "Jackie Diamonds", "Jackson Vile", "Jalala La La", "Jalapeño Fireball", "Jam Chops", "Jane Cheney", "Janet Planet", "Jaws", "Jay Cruder", "Jay Krewd", "Jazzy Jim", "Jean Jacket Pool", "Jean Pool", "Jeer Cheer", "Jello Tangent", "Jelly Baby Red", "Jelly Finch", "Jellybird", "Jenny Toil", "Jet Leg", "Jetsam’s Club", "Jetsilk", "Jezebel’s Joint", "Jigging Sinatra", "Jiggy Torpor", "Jimmy Rogers", "Jock and Judy", "Joe Cuzzi", "Joey Conundrum", "Jolted by Truth", "JotBox", "Joviold", "Judy Punch", "Jug Lore", "Juggler’s Jig", "Jugulawyer", "Juice Jones", "Juice Monster", "JuiceMaster", "Juke London", "Jules and Gems", "Jumbo Grunion", "Jump Jack", "Jumpstack", "Jumpstart", "Junk Mail", "Junkcrusher World", "Jupiter Trolley", "Jupitor Place", "Jurassic Pork", "Just Say Know", "Just Sell Baby", "Justin Time", "Jute Box", "Kafka Medecine", "Kafka’s Klues", "Kaput Krash", "Karaoke Dentist", "Karma", "Karma Check", "Karma Farm", "Karma Suit", "Karma Suit Trap", "Karma Suture", "Keen Clip", "Keeper’s Promise", "Keister’s Kiss", "Ken Dread", "Ken Dread Spirit", "Kettle Pa", "Kibbles and Kitsch", "Kiddie Wizard", "Kimono Open", "King Bling", "King Chard", "King Conundrum", "King Grudge", "King Pong", "Kiosk", "Kioxi", "Kiss My Buddha", "Kitty Litter", "Kiwi Herman", "Klaus Kinski", "Kneedles", "Knock Three Times", "Know Order", "Know Show", "Konnectron", "K-opec-ked", "Kudos Falling", "Kult", "Kundalini Snort", "La Loopy", "Lady Playd", "Lamb Chowder", "Lance Ito", "Landmark of My Youth", "Landscapel", "Largemount", "Larry Skinflint", "Lartego", "Lasix", "Latté Prey", "Laugh Tax", "Laughlin Need", "Lauralight", "Lava Drone", "Lavadome", "Le Gall", "Leaping Lemur", "Left Blank", "Legal Ease", "Legal Tender", "Letpro", "Lettuce Prey", "Lewd Licorice", "Lexington 1 Up", "Lexington Panache", "Li Li Chiq", "Libation Nation", "Libby Dough", "Liberace", "Libido", "Libido Donut", "Libido Shuffle", "Libidon’t", "Lice on Mars", "Lick Lustre", "Lick the Toad", "Life Audit", "Life’s a Hit", "Lil’ Moriarty", "Lil ‘Ol Creole", "Lillytrope", "Limber Timber", "LimLim", "Limozen", "Lincoln Blvd", "Lingo Bingo", "Lion Sack", "Lip Frog", "Liquid Ambassador", "Liquid Kitty", "Liquid Radiant", "Liquid Space", "Liquid Theatre", "LiquiSpace", "Little Dostoevsky", "Little Mussolini", "Lizzie Borden", "Loan Wit", "Loca Mocha", "Local Focal", "Local Globe", "Loco Motion", "Loin Lounger", "Loin Ranger", "Lolaitan", "Lolipop Flower", "Lolita Proud", "Lolitass", "Lollilo Lolo", "Lolly Chelsea", "Lollytart", "LoLoILikeThatName", "Long Planet", "Looner Crooner", "Loop Hole", "Looping Buddha", "Loopy Tuna", "Loot", "Loot 66", "Lord Chuby Cheeks", "Lord Debit Card", "Lord Gunneysack", "Lord Hatchback", "Lord Martini", "Lost Floss", "Lotto Lita", "Lotto Love", "Lotus Boogie", "Lotuscany", "Lou Cid", "Loud Matrix", "Love Bomb", "Love Digit", "Love That Loot", "Lovebox", "Lovebox Hotel", "Lovely Lovely Two", "LoveMusic", "Low Bald", "Low Balled", "Low Coil", "Low Downey", "L-Spot", "Lucyd", "Lunch Rumi", "Lunchpod", "Lutheran Luau", "M80", "Ma Cranky", "Mach Epoch", "Macro Monk", "Mad Gravity", "Mad Matrix", "Mad Nest", "MadRush", "Magellanic Dumbo", "Magellanic Penguin", "Magic Putter", "Magma Pure", "Magma Radiant", "Magmina", "Magnemo", "Magnetic Cocoon", "Magnetosphere", "Magnina", "Major Major Major", "Make Your Day", "Malathion", "Malibu Slide", "Malingering Doubt", "Mallard Air", "Mall-nourished", "Mama’s Bug", "Manager Man", "Mangelica", "Manglo", "Maniacal Miss", "Manic Management", "Mannequin Mime", "Mannequin Mogul", "Manson", "Mantis", "Mantis Milk", "Mantrix", "Mantro", "Maple Thor", "Market Tang", "Marquis de Sob", "Marshmallow Man", "Martha Stalwart", "Marvain", "Marvane", "Marzipansy", "Masquerade", "Master Atom Blaster", "Master Don", "Master Fate", "Masters Decree", "Mastic Fantastic", "Maternity Warden", "Matre Deviant", "Matre Devious", "Matter of Fast", "Mattermind", "Matzo Boil", "Maudelyn Monroe", "Mauve Certain", "Mauve Ho", "Mauve Lava", "Mauve Over", "Mauve Rocket", "Mauve Suave", "Mauvie", "Media Darwin", "Media Mop", "Media Pet", "Medulla Mortadella", "Medulla the Fool", "Megabeth", "Melding", "Memeosphere", "Memory Loft", "Memory Works", "Mench Your Match", "Menthol", "Meow", "Merger Mystery", "Merlin", "Mermaidian", "Methoding", "Mi Thai Kind of Guy", "Mia My", "Miami Over Moon", "Micro Ho", "Micro Monk", "Micro Monkey", "Micro Morphis", "Micronaut", "Midnight Commuter", "Mike Haste", "Mile Mannered", "Mile Monger", "Miles Alpha", "Miletus", "Milieu", "Milk Machine", "Milvio", "Mind Music", "Mind Over Mayhem", "Mind Rocket", "Mine the Zone", "Mineral Spirits", "Minga", "Mini Bar", "Minimizer’s", "Minsk Meat", "Mint Dynasty", "Minute Matriarch", "Miqelique", "Mirror Mirror", "Mirtha", "Miss Americana", "Miss Demeanor", "Miss Leading", "Miss Madness", "Miss Mary Mackin’", "Miss Thought", "Missle Epistle", "Missle Morning", "Mister Nipple", "Mo Hell", "Mo Mauve", "Mobile Huge", "Mobile Mosque", "Mobillowing", "Mobius Void", "Mock Epoch", "Mod Cow", "Mod Hog", "Mod Pod", "Mod Tap", "Modicrumb", "Modicrumb Cake", "Mold Music", "Moltantric", "Molten Plaid", "Moltonic", "Mon Jovi", "Mondicil", "Mondo Bocci", "Mondo TVA", "Monk Ease", "Monkey Double", "Monque", "Monsoon Buffoon", "Montake", "Montauk Mantra", "Montoxic", "Mood Lantern", "Moon Boon", "Moon Milk", "Moonshine Wagon", "Moose Toe", "Moot Guru", "Moral Cowboy", "Moral Less", "More Than More", "Moretoll", "Moriarty", "Mosh Potato", "Mountain Mud", "Moxi Biloxi", "Moxy Turtle", "Mr. 24-7", "Mr. Big and Tall", "Mr. Big Bend", "Mr. Buttondown", "Mr. Chaser", "Mr. Cup-a-Soup", "Mr. Demeanor", "Mr. Down and Out", "Mr. Ducky", "Mr. Flosty", "Mr. Fortnight", "Mr. Little Fingers", "Mr. Losty", "Mr. Mackin’", "Mr. Mercurial", "Mr. Nancy", "Mr. Particular", "Mr. Pin Action", "Mr. Prohibition", "Mr. Prohibitor", "Mr. Punnymoon", "Mr. Rubber Room", "Mr. Sadie", "Mr. Scoopy", "Mr. Shirley", "Mr. Soil Sample", "Mr. Successor", "Mr. Sunnymoon", "Mr. Surely", "Mr. Tee", "Mr. Ten Pin", "Mr. Unexplainable", "Mr. Wonderful", "Mrs. Beasley", "Mrs. Clean", "Mrs. Webley", "Ms. Beehaven", "Ms. Demeanor", "Ms. Dialed", "Ms. Ducky", "Ms. Excellency", "Ms. Marx", "Mud Puppet", "Mudlyn", "Mudrick Forest", "Mum", "Mumble Be", "Mumble Bee", "Mundee", "Musanpoly", "Muse Hacker", "Muse Lee", "Mustard Plaster", "My Bad", "My Oh Guru Mai", "Mystic Blowout", "Mystic Poppy", "Mystic Zilla", "Mystical Union", "Nader Ration", "Naive ET", "Naked Lunch", "Namby Pam B.", "Namedness", "Nanna Banana", "Nano Bait", "Nanyxsi", "Narrow Barrow", "Nasal Picnic", "Nasdact", "Nasdaction", "Nasdaquiri", "Nastenka", "Nasty Good", "Nastylicious", "Native ET", "Natural Silence", "Navajo Dad", "Nectar Princess", "Needles Penthouse", "Needles to Say", "Nefarious Splendor", "Neitsche", "Neitsche Forest", "Neocent", "Neptide", "Nerve Saw", "Nest Vesting", "Netplosive", "Netstalgic", "Neuro-Victory", "Neutrino", "Never No", "Nevsky Prospects", "New Dad", "New Gut", "New Orleans Ivan", "New Sense", "New Whirled", "New Whirled Order", "New World Odor", "Newly Wedlock", "Nexost", "Next of Kin", "Nicey Nice", "Nicolt", "Nifty Glob", "Nightwords", "Niquent", "No Convent", "No Harm No Charm", "No Pun Intended", "Nob Hill", "Noise Blossom", "Norse Code", "Norse Nurse", "Norseback", "North Quark", "Northern Flourish", "Nose Blind", "Nose Curtains", "Nose Music", "Noslow", "Nostalgia Dive", "Nouveau Ruckus", "Nouveau Whirled", "Noxobi", "Nspire", "Nude Attitude", "Nudist Buddhist", "Nusfat", "Nutritious Pirate", "Nuxa", "NYAccord", "Nylon Prawn", "O Jackie", "Obama Rama", "Obamanon", "Occasion Alice", "Occasion Olly", "Ocea", "Oceanary", "Oceanary Soul", "Octorex", "Ode If Ferrous", "Oedipast", "Oedipus", "Of Corsica", "Off Coffee", "Off the Cufflinks", "OffAndOn", "Officer Lovely", "Ogle Mogul", "Oh Jimmy", "Oh La Canada", "Oh My Hovercraft", "Oh That Baby", "Oil Patched", "Old Mango", "OldMenEatCookies", "Olucore", "Omahaughty", "Omahotty", "Omatom", "Omnigod", "Omnipotaunt", "On Again Cardigan", "On Any Line", "On High", "On The Wagon", "Once’t", "One For Al", "onFire", "Open the Window", "Opinion Minion", "Opt In", "Optique", "Orb", "Orbaxter", "Orbean", "Orbin", "Orbital Logic", "Orbiting Sister", "Orbitoil", "Orbixtar", "Orchestrata", "Original Bloom", "Ornamantis", "Ornamench", "Orno", "Orphan Swells", "Oscillation", "Ou Are Tu", "Ouch Pouch", "Oui Oui Mr. T", "Ouija", "Oulu Bar", "Oulu Rocinante", "Out of the Box", "Outer Granola", "Outside the Boxers", "Oval Ocean", "Ovation Inn", "Overchurros", "Overfork", "Overplex", "Ovum Trove", "Oxenfree", "Oy Division", "Oy to the World", "Oy Vega", "Oy Vegas", "Ozean", "Pa Cranky", "Pa Kafka", "Pablo Pick Ax O", "Paint By Numbers", "Painter Lee", "Palladium Moxy", "Palms for Psalms", "Paloma Morganstein", "Panache", "Pancho Casanova", "Pancho Village", "Pandora’s Boxers", "Pang", "Pang Meringue", "Panic Attack", "Panic Button", "Panoptimist", "Panzent", "Paper Lass", "Paper Machete", "PaperPlastic", "Pappy’s Veranda", "Papricut", "Paraloco", "Paramedic Pirate", "Paranoma", "Paris Taxes", "Parish Able", "Partial Toast", "Particle Farm", "Parvenu Charlie", "Parvenu Guru", "Pass the Glory", "Pass the Swordfish", "Pastor Feltbomb", "Pastor’s Planet", "Patty Meltdown", "Paul Tree", "Paul Treesum", "Paula Revered", "Pave to Own", "Paved Curtain", "Pawn Panic", "Pawn Pawn", "Pawn Queen", "Pawn Storm", "Pawnagra", "Pay Bach", "Pay Shunt", "Peace by Peace", "Peace Meal", "Peace of Cake", "Peace Police", "Peace Unearth", "Peacemeal", "PeacePipe", "Peach Envy", "Peach Fuzz", "Peachy Preachy", "Peak", "Peanuts Envoy", "Pearl on Girl", "Pearl Unfurl", "Pearlescient", "Pearlesex", "Pearlessa", "Peek-A-Boo", "Peek-A-Buddha", "Peer", "Peerless Dulcinea", "Pelé Monty", "Pelvic", "Pen the Tale", "Penelope Paj", "Penelope Sky", "Penguin Cloud", "Penny Arcane", "Penny Foolish", "Penny Karma", "Pente Bob Costal", "Penundral", "People Pipes", "Pepp", "Pepperboard", "Pepto Mosh", "Perfomancer", "Performancierge", "Peril", "Periods of Rain", "Perma Bear", "Permablonde", "Permanent Nudge", "Perplexia", "Pesto Quest", "Pet Rock Band", "Peyote", "Phaedra", "Phat Chic", "Phat Transient", "Phatsi", "Phatsie", "Pheast", "Pheno", "Phil Lament", "Phil Tantric", "Phit Bit", "Phoebe Kinks", "Phoebe Snowtire", "Pholio", "Photon", "Phottie", "Phox", "Phrasemonger", "Phuel", "Picky Wicket", "Picnic Train", "Piece O’ the Action", "Pier Deer", "Pier Groupie", "Pierced by Lugosi", "Pile Driver", "Pilgrim Marge", "Pine Soul", "Pineapple Day", "Ping Po", "Pink Hundred Watt", "Pinnacoil", "Pippiripped", "Pippy Wrongstockings", "Pirate Bath", "Pirate School", "Pirates of Purchase", "Pissed Aunt", "Pisserd", "Pistol Whiff", "Pixel Blossoms", "Plaid Certain", "Plan Saphron", "Planet Harry", "Planet Haste", "Planet Paltry", "Planet Reno", "Planet Right", "Planet Terry", "Planet X", "Planetary Profit", "Plank 10", "Plastic Fantastic", "Plastic Pasta", "Plasto", "Plato’s Crave", "Plato’s Promise", "Pleth Aura", "Plum and Bone", "Plum Dumb", "Plumb Bum", "Plumb Magic", "Plutorque", "Po", "Pocket Tones", "Pod Squad", "Podunk", "Podunk and a Prayer", "Podunk Punch", "Poifect", "Poker Prey", "Pokerture", "Polar Ocean", "Polar Viagra", "Polarian", "Polarium", "Polio Pony", "Political Athena", "Pollyantics", "Pomegarnet", "Pomme Juan", "Pomona Lisa", "Pomperstance", "Pond Scam", "Pondering Rosa", "Pontoon Eternity", "Pony Spumoni", "Poor Trot of a Horse Player", "Popcorn Born", "Popcorn Logic", "Popo", "Poppy GoGo", "Poppy Heathcoat", "Poppydom", "Pop-up Buddha", "Portable Bellow", "Posh Omen", "Position", "Post Mortadella", "Postal", "Potata Pathos", "Potato Constant", "Potato Pathos", "Potter Training", "Power Fool", "Power Shadow", "Powerhead", "Pox in Socks", "Practical Pork", "Praise Be Retrace", "Prarie Fire", "Prawn Logic", "Prawn Queen", "Prawn Tong", "Pray and Play", "Pray for Latté", "Preacher Comforts", "Preacher Perfect", "Preacher’s Pet", "Preachy King", "Predicting Jeanne", "Prell", "Prenup and Tuck", "Presidaunt", "President of Vice", "Pretundra", "Pretzel", "Prevert", "Prey for Piece", "Pride Aside", "Pride Forgery", "Prim Pricket", "Primorbit", "Primordia", "Prince Myshkin", "Prince Tool", "Princess Eschew", "Princess Fresh", "Princess Jellybean", "Princess Mile", "Princess Nellie", "Princess Plex", "Princess Quipp", "Princest", "Prior Tease", "Prison Smarts", "Prisoner Scratch", "Prize Flight", "Probiscus", "Prodigal Sunburn", "Productive Panic", "Prom Thumb", "Prom Yule Gate", "Propagander", "Prophet", "Prosely", "Proto Chez", "Protoshape", "ProtoSpasm", "Psycho Kitty", "Psychotrone", "Psyclopes", "Puff Chuck", "Pull a Fastow", "Pumping Station", "Pumpty Dumpty", "Punacium", "Puncake", "Puns and Needles", "Puppet Box", "Puppet Show", "Purb", "Pure Penguin", "Purpletown", "Pyro Hero", "Qaboos", "Qimonk", "Quadvert", "Quadzoonple", "Quake Dance", "Qualm Temptress", "Quantiful", "Quarx", "Quazonor", "Que Papa", "Que To Que", "Que West", "Queen Beam", "Queen Conundrum", "Quencha", "Question Quest", "Questionable Behaivor", "Quick Turtle", "Quickie Lickie", "Quiet Papas", "Quiltreen", "Quimby Heights", "Quincy", "Quintavi", "Quintessa", "Quizmo", "Quizmu", "Quiznost", "Qule", "Qult", "Qunder", "Quz", "Rabid Rabbit", "Raccoon Tour", "Radamus", "Radiant Butane", "Radiant Earth", "Radiant Ease", "Radiant Fire", "Radiant Penguin", "Radiant Swift", "Radiantix", "Radio Certainty", "Rail Jail", "Rain Fire", "Rambino", "Ranch Cross Dressing", "Rancho Botox", "Rancho Django", "Rancho Fiesto", "Rancho Viagra", "Random Excellence", "Randy", "Rank", "Rap Doodle", "Raspberry Perfect", "Rasta Static", "Raw Harm", "Ray She Oh", "Razor Horse", "Razor’s Edge", "Razzbo", "Razzle Dazzle", "Reach For Peace", "Realm of the Woods", "Reap the Mercury", "Rebar", "Rebuttal Rocket", "Recess", "Recordshop", "Red eScent", "Red Nerve", "Red Thunder", "Reform Torn", "Remotion", "Renalator", "Rendezboom", "Reno Boy", "Reno-no", "Repittance", "Repo Mantis", "Rescue Me", "Resorcerer", "Restraining Order", "Retail Dentist", "Retinal Pinprick", "Retro", "Retro Cocoa", "Retro Plum", "Retro Ready", "Retro Rococo", "Retro Salts", "Retro Sin", "Retro-Yo", "Retsin", "Reverie Financial", "Revering Lady", "Revering Larry", "Revering Paula", "Reverse Curse", "Reversus", "Revisionass", "Reward Chord", "Riboflavin", "Right Hand Red", "Right on Broadway", "Rin Tin Thin", "Ring Bling", "Ringers Lactate", "Rio Rocinante", "Ripple Effect", "Risking Nostalgia", "Risky Pesto", "Ritual Wave", "Road Kool", "Roadrageous", "Robin’ the Hood", "Robo Tox", "Robotox", "Rock My Pony", "Rock of Aged", "Rock Okra", "Rock Oprah", "Rocket Logic", "Rocket Red", "Rocket Silence", "Rococo", "Rodeo Oracle", "Rogue Temptation", "Roll the Dole", "Roll Troll", "Rolling Bingo", "Roman Tess", "Romeo Mauve", "Ronbert", "Ronelon", "Rooster Fuzz", "Roostin’ Pete", "Root Cannoli", "Rosy Slang", "Rough Age", "Row Bust", "Royal Lush", "Royal Pudding", "Royal Tease", "RSVP", "Rubber Slapjack", "Ruby Friday", "Ruby Suite", "Rumi", "Rumor Goddess", "Run Baba", "Run Baba Run", "Run-a-Monk", "Run-a-Monkey", "Runaway Proton", "Running Numbers", "Runny Norse", "Rush Limbo", "Rutabaga Darling", "Rutabaga Princess", "Ruthless Toothless", "Saber Kath", "Sadat", "Sadie Blue", "Saginaw on That", "Saint Aphasia", "Salon Da Bomb", "Salsa Man", "Salt the Taffy", "Salty Pudding", "Salty Thursday", "Salvador", "Sam Lambster", "Samopolis", "San Francisco Mint", "Sanchica de Ville", "Sand Waves", "Sans Charo", "Saphire Rose", "Saphron Sunrise", "SAR Donic", "Sara Bellum", "Sara Soda", "Sara Vellum", "Sarasonic", "Saratoga Surge", "Sarcasmic", "Sartepoint", "Saskatchewonder", "Sasskatchy!", "Sassybox", "Satelite Ranch", "Sausage", "Save the Ants", "Save the Date", "Scalpel Scrupulous", "Scatterbox", "Sceen Seen", "Scene Beam", "Scene Not Herd", "Scene Serene", "Scentric", "Scissor Fresh", "Score 4", "Scrape By", "Screaming Tuesday", "Sea Brisket", "Sea Edge", "Sea Quimby", "Sea Quinn", "Sea Script", "Sea Sleigh", "Sea Spam", "Sea Tan", "Sea Windsor", "SeaMountain", "SeaSky", "Season Al", "Sea-Sought", "Second That", "Seedy Beady", "Selective Depression", "Señor Circumstance", "Señor Serene", "Sensei Wheezy", "Sensor Ship", "Sensora", "September 10th", "Sequin", "Sequitur", "Serendipity", "Serpent Stance", "Seven Scentric", "Sgt. Buttercup", "Shackled", "Shakes the Clown", "Shakespeare", "Shangrilatte", "Shape the Scape", "Share Reef", "Sharkspot", "Sheath", "Shelly Half", "Shhh!", "Shirley Ujets", "Shock and Almonds", "Shoe Roosevelt", "Short Change", "Shostakovich", "Show Me The Data", "Shrilly Nilly", "Sidecar Jesus", "Sigh Bore", "Sigh Clone", "Sigh Girl", "Signity", "Silent Swift", "Silver Demand", "Silver of Mine", "Simon Rusty", "Sin n’ Spin", "Sin Thesis", "Sinch", "Sindromo", "Single Happiness", "Sip and Shout", "Sir Donna", "Sir Drone", "Sir Flotsam", "Sir Jetsam", "Sir Miser", "Sir Render", "Sister Borneo", "Sister Karen", "Sister Resister", "Sisterine", "Sizzling Brainpan", "Skeeter Scare", "Skin Deeper", "Skinny Boboli", "Sky Theory", "SkyMountain", "Slackered", "Slam Banjo", "Slap Sad", "SlapJack", "Sleeper Waves", "Slicer Dicer", "Slim Tricks", "Slingshot", "Slingshot Slice", "Slope", "Slumlord", "Slush Fund", "Smackdab Init", "Smart Ask", "Smarty Jonestown", "Smash and Grab", "Smashed Adam", "Smashing Adam", "Smile Quotient", "Smokin’ the Data", "Smootch and Potato", "Smorgas Borgnine", "Smote", "Snack Pony", "Snape", "Snarkive", "Snatch Shacks", "Sniff Test", "Snore Over", "Snow Flake", "Snow Pundit", "Snowpoke", "Snub Hall", "Snunt", "Snunting", "So Long Barleycorn", "So So Choritzo", "So So Toboso", "So Young So Cruel", "Socratease", "Soda Baking", "Soft Shark", "Sola Menthe", "Solar Bingo", "Solar Certain", "Soledad", "Solevatent", "Solgan", "Solvang", "Solvang Chime", "Solvang Positive", "Some Much More", "Son of a Muggit", "Sonata Fast", "Sonny Disposition", "Sonny Pro-Bono", "Soprano", "Sorb", "Sorrel Bell", "Soul Centric", "Soul Combat", "Soul Depot", "Soul Kitch", "Soul Kitsch", "Soul Massage", "Soul Ocean", "Soul Potato", "Soul Pub", "Soul Sketch", "Soul You Know", "South South South", "Souther Proper", "Sow the Know", "Sow You Know", "Sox Box", "Soy Christmas", "Spam and Deliver", "Spare a Digm", "Spavane", "Spavin", "Spawn Chalant", "Spawn Shawn", "Special Space", "Speed Seed", "Speedbolt", "SpeedSpot", "Sphere", "Spigothead", "Spin Cyclical", "Splinter", "Splinter Kiss", "Spong", "Spooncake", "Spore of Kings", "Sportan", "SpotOn", "Spotted Al", "Spree Squeegee", "Springbee", "Sproil", "Spum Blue", "Spumoni Rocket", "Spy Roiling", "Squeegee Spree", "Squish", "Stage Left", "Stamina", "Stan Happen", "Stand Churchill", "Star Bored", "Starbuxom", "State of Fish Oil", "Stavrogin", "Stealth Management", "Steam Beat", "Stella Starboard", "Steps Into Living", "Steve Bomber", "Stock Operator", "Stone Error", "Stone Plenty", "Stone’s Throw", "Storybook Omelette", "Stovk", "Str8 at Ya", "Streetsmacker", "Strideline", "Striding Light", "Strip Drag", "Strombo", "Strombosis", "Strozen", "Strydesdale", "Stucco", "Stunt Cake", "Sub Dude", "Sub-lime", "Subterfuse", "Subterfusion", "Subtle Relief", "Subtle Stubble", "Sudden Debt", "Sudden Enemy", "Suffix to Say", "Sugar and Price", "Sugar Dog", "Sugar Doggy", "Sugarpine", "Sultrax", "Sun Bite", "Sunbit", "Sunbright Sparrow", "Sunbright Swallow", "Sunclipse", "Sunnyside Street", "Sunset Bird", "Super Ciao", "Super Cog", "Super Scale", "SuperHelix", "Surely You Jones", "Surrealient", "Sushi Blue", "Sushi Spam", "SUVegan", "Svelt Smelt", "Swallow the Sun", "Swanky Hankie", "Sweet Virginia", "Swift Shift", "Swim Beam", "Swing Bing", "Swing Bling", "Swing Sing", "Symbiotica", "Synchro Storm", "Syndrome Dome", "Syndromo", "Tab Bandit", "Tab for the Future", "Tae-Can-Do", "Tale of the Snail", "Talibanter", "Tango Bango", "Tango Latté", "Tango!", "Tantric Jones", "Tanzar", "Tarnex", "Tarpedo", "Tarzana Sunrise", "Tarzantics", "Tattoo Pride", "Taunting Debut", "Tawney Port", "Taxi Dance", "Taxus", "Té Tango", "Teacher’s Pet", "Teaky Freaky", "Tears for Tours", "Teazy Pleasey", "Tech Tech Goose", "Techmania", "Technoasis", "Teeth Wreckage", "Tele Vangelis", "Telecommie", "Telemarket King", "Telemarket Tear", "Telligenics", "Telluride Glide", "Tellurider", "Temporal Freeze", "Temporary Larry", "Temporary Vegetable", "Temptatious", "Tempura Sunrise", "Ten Pen Alley", "Tennyson Woodbridge", "Tequila Mockingbird", "Terra Cotta Jones", "Terra Monk", "Terra Trona", "Terrago", "Terrapod", "Territory Al", "Terror Firm A", "Terror Pharma", "Tersanki", "Tessid", "Texx", "Thackeray", "Thar Hills", "That Swing Thing", "The Adhoc", "The Atomizer", "The Baggage", "The Bakery Rave", "The Bali Who", "The Bane", "The Barkley", "The Beluga Belt", "The Bid and Ask", "The Big One", "The Brime", "The Bronsen Account", "The Captainstance", "The Chickery", "The Chute", "The Contender", "The Contessa", "The Cost is Clear", "The Cranky’s", "The Critic", "The Crowd", "The Crustacean", "The Cubic", "The Curmudgeon", "The Deuce", "The Dissident", "The Dollop", "The Dreamery", "The Element", "The Fidget", "The Flight", "The Flotsam Jetset", "The Fondler", "The Gipper", "The Glean", "The Gleen", "The Go Lucky", "The Hedonist", "The Hermit Wars", "The Jolt", "The Jones", "The Knotch", "The Loop", "The Lunch", "The Lunchroom", "The Mobe", "The Monte Magum", "The Noise", "The One-Up", "The Panky", "The Plutarch", "The Portion", "The Possessed", "The Prudence", "The Retail Age", "The Revisionist", "The Ripper", "The Sanguine", "The Secretarian", "The Sedge", "The Sedgewick", "The Sitch", "The Snark", "The Snub", "The Soledad", "The Spirit", "The Stranger", "The Swift", "The Tawd", "The Torquemada", "The Trotsky Leon", "The Turgenev", "The Turn", "The Wedge", "The Wellborne", "The Yesterday Guy", "Then There’s Modell", "Therapy Wagon", "Third Eye Focus", "Thirst and Howl", "This Damn Planet", "This Little Big", "This That and the Phat!", "Thong Bong", "Thong Thong Blue", "Threepenny Oprah", "Throughput", "Thumb Butter", "Thundadendron", "Thunder Under", "ThunderBag", "Tick Talk", "Tidal Yule", "Tim Tation", "Time Squares", "Tino Cooper", "Tiny Potatos", "Tip, Toe and Go", "Tipper Tape", "Titonic", "Toggle", "Toggles", "Toilstoy", "Tokyo Yo", "Toledo Sunrise", "Toll Trona", "Tom Foolery", "Tom Foolery Inc.", "Tomorrow", "Tomorrow’s Jello", "Tongue and Groove", "Tongue in Chic", "Too Chez", "Too Faux", "Tool Blue", "Toot Boot", "Tooth Fury", "Tori Bora", "Tori Spelling", "Tori Spelling Salts", "Tori Tori Tori", "Torpor Larry", "Torpor Ritz", "Torpor Royale", "Torpor Senate", "Torpor Speedo", "Torquemada", "Tort Resort", "Tortoise Tactics", "Torvin", "Tory Tory Tory", "Touch Zone", "Towering Baba", "Toxic Pop", "Toy Botox", "Tozy", "Traffic Storm", "Traffic Swarm", "Transfer Station", "Transluscent", "Trasola", "Tre Trio", "Trench Coat", "Trend Matter", "Tres Huggers", "Trigger Hippy", "Trinity Trona", "Trips not Trips", "Tripsch", "Troll Tones", "Troll your own", "Trollery", "Trona Trinity", "Trophyplex", "Tropicandy", "Tropicantor", "Tropicava", "Tropolis", "Trouble Bubble", "True By You", "True Faux", "True Fo", "True Foe", "Truth Be Tolled", "Truth or Darren", "Truth Spock", "Truth Turtle", "Tsunami", "Tsunami Endgame", "Tulsa Watch", "Tumblebee", "Tunapocalypse", "Tunnel Circuit", "Turf Builder", "Turf Damage", "Turfbuster", "Turning Radius", "Turnling", "Turnpike", "Turtle Problems", "Turtle Quick", "Turtle Soup for One", "Tuscany Tucson", "Tustin", "Tweezerland", "Tweezy", "Twelve Foot Fetish", "Twelve Foot Flower", "Twiggery", "Twiist", "Twinkies Don’t Count", "Two Faux", "Two Like You", "Two-ply Paradise", "Tyro Scene", "Uberlux", "UberPrawn", "Uh Oh-Bama", "Ulti-Mate", "Ultra Mouse", "UltraAll", "Ultrafloxi", "Ultrasounder", "Umbrella Wet", "Umpa Lava", "Unacho", "Unbridaled Amy", "Uncertainty", "Uncle Billychord", "Uncle Goldilocks", "Uncle Thunder", "Under Thunder", "Underbelly", "Undertap", "Unfurl Faithful", "Uni", "Uni Bar", "Uni Certainty", "Uni Magic", "Unit Socrates", "Universal Impact", "Un-pleasanton", "Up Gusty", "Upper Dinero", "Urban She", "Urban Sturgeon", "Urbanshee", "Us Festival", "User Friend Lee", "Utara", "Utarian", "Vacant Lot", "Valpreal", "Valreda", "Van Mango", "Vanity Veer", "Varmetta", "VC Promenade", "Vegan Cool", "Vegone", "Vegoon", "Velcro", "Veltiphid", "Velvet Wage", "Ventura Capitalist", "Venus Backlash", "Venusian", "Vera Real", "Veritable Slew", "Vernon", "Viaccident", "Viacrobat", "Viagabond", "Viaggravation", "Viagrandy", "Viagravate", "Viagreat", "Viasia", "Vicadan", "Vicious Suave", "Victor He He", "Victor Yugo", "Vigration", "Viokra", "Vioscillate", "Vireal", "Virginia Sweet", "Virginia Wolf", "Virile Real", "Virquile Reality", "Virtual CEO", "Visanity", "Visionary Summit", "Vitamin Seed", "Vodka", "Voleme", "Volthe", "Volvo Vitae", "Voodles", "Voodoo Dating", "Voodoo Vat", "Voodude", "Voodude Ranch", "Voodulce", "Vortax", "Vortes", "Vortex Mex", "Vortez", "Vortox", "Vow Vagner", "Vulture Culture", "Vvirile", "Waab", "Waffle Stomper", "Walla Wild", "Waltzing Meridian", "Wannabe Grand", "Wannabe Heights", "Wanton Scholar", "War Auntie", "War Bonnet", "War Chess", "War Chord", "War Jones", "War Jonesing", "War of Attrition", "Warleg", "Was Honey’s Money", "Wasabi Fresh", "Wasabi Good", "Water Back", "Water Whole", "Wax Planet", "Wayward Postal", "We Monsieur", "We Need an Iceberg", "Weeeeeeeee", "Welchommie", "Welcome To Mind", "Wellborne Hall", "Wes World", "West Bay Adjacent", "Western Vacation", "What Ice Age Goes", "Whip Lass", "Whirling Turvy", "Whisper Flower", "White Trash River", "Who Art in Heaven", "Who Voodoo", "Who’d a Thong?", "Whole Loop", "Whole Lotta’ Lita", "Why Oh Ming", "Wicked Bored", "Wicked Cute", "Wicker Dicker", "Wicker Palace", "Wicker Script", "Wig Money", "Willy Wicket", "Win a Bagel", "Win Doctor", "Wind Shear", "Winky Stinget", "Winnetka Boom", "Wire House", "Wire Lass", "Wirelass", "Wisdummy", "Wise Yankee", "Wish Kiss", "Withdraw McGraw", "Woe Esme", "Woe is Free", "Wonka Renewal", "Word Herd", "Word Salad", "Wordlobster", "Wordmonger", "Work Flirt", "Worker B.", "World Con", "World Cop", "World Sage", "Wrath’s Path", "Wreck Lass", "Wren", "XENO Sphere", "Xerex", "Xleen", "Xoggle", "XORCat", "Xorette", "XORtrak", "XSeed", "Xth", "Xumonk", "Xylar", "Xylo", "Xymonk", "Y2 Kiki", "Yahoodoo", "Yangtze Doodle", "Yardvark", "Ye Old Neil Young", "Yearlove", "Yeasty Pete", "Yes Sir Rotisserie", "Yester Yore", "Yo Comprehension", "Yo Phat!", "Yo Yo Tokyo", "Yo Yorkshire", "Yo Yo’s Place", "Yoga Jones", "Yoga Prose", "Yorba Linda Trip", "You’re So Vein", "Y-oWhy", "YoYo Go", "Yucatango", "Yumber", "Zachary All", "Zaggles", "Zaj", "Zamora", "Zamox", "Zanymax", "Zap Shack", "Zaphire", "Zboo", "Zedalis", "Zeen Scene", "Zelpo", "Zen Shin", "Zen Tax", "Zen Warship", "Zenacity", "Zendo", "Zenka", "Zenlighten", "Zensure", "Zensus", "Zentricity", "Zerb", "Zero Algorhythm", "Zero Logic", "ZeusNoose", "Zialactic", "Zidant", "Ziggles", "Zilencio", "Zilidium", "Zilla Drop", "Zilla Nation", "Zillaberry", "Zillabug", "Zillactic", "Zilladelphia", "Zillagoogle", "Zillan", "Zillatide", "Zilodyne", "Zinaidia", "Zinbad", "Zinch", "Zinta", "Ziore", "Zipak", "Zizzle", "Zizzy", "Zizzy Blue", "Zoarere", "Zolar", "Zolarex", "Zolarity", "Zolavo", "Zombie Logic", "Zoo Butter", "Zophie", "Zuke", "Zupiter", "Zutros", "Zyple", "Zytrex"],
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
    for (var c = 0; 3 > c; c++)
      this.cellChanged(b[c], d[c]) && (b[c] = d[c])
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
