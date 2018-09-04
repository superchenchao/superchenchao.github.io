require = function() {
  function e(t, n, r) {
    function s(o, u) {
      if (!n[o]) {
        if (!t[o]) {
          var a = "function" == typeof require && require;
          if (!u && a) return a(o, !0);
          if (i) return i(o, !0);
          var f = new Error("Cannot find module '" + o + "'");
          throw f.code = "MODULE_NOT_FOUND", f;
        }
        var l = n[o] = {
          exports: {}
        };
        t[o][0].call(l.exports, function(e) {
          var n = t[o][1][e];
          return s(n || e);
        }, l, l.exports, e, t, n, r);
      }
      return n[o].exports;
    }
    var i = "function" == typeof require && require;
    for (var o = 0; o < r.length; o++) s(r[o]);
    return s;
  }
  return e;
}()({
  BarrierPool: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "7bb27TQE+REzK5i1AAMlfGF", "BarrierPool");
    "use strict";
    var barrierG = cc.Class({
      name: "barrierG",
      properties: {
        name: "",
        freqTime: 0,
        initPollCount: 0,
        prefab: cc.Prefab
      }
    });
    cc.Class({
      extends: cc.Component,
      properties: function properties() {
        return {
          barrierG: {
            default: [],
            type: barrierG
          },
          leftPos: {
            default: null,
            type: cc.Node
          },
          rightPos: {
            default: null,
            type: cc.Node
          }
        };
      },
      onLoad: function onLoad() {
        this.pauseSpeed = 0;
        this.node.zIndex = 2;
        this.eState = D.commonInfo.gameState.start;
        D.common.batchInitObjPool(this, this.barrierG);
        this.getNewBarrier();
      },
      getNewBarrier: function getNewBarrier() {
        var circulNum = 0;
        var ei = -1;
        circulNum = 0 == Math.floor(2 * Math.random()) ? 1 : 2;
        for (var index = 0; index < circulNum; index++) {
          if (index > 0) while (0 == ei) {
            ei = 3 * Math.random();
            ei = Math.floor(ei);
          } else {
            ei = 3 * Math.random();
            ei = Math.floor(ei);
          }
          var poolName = this.barrierG[ei].name + "Pool";
          var newNode = D.common.genNewNode(this[poolName], this.barrierG[ei].prefab, this.node);
          var newV2 = this.getNewBarrierPositon(newNode, index, circulNum);
          newNode.setPosition(newV2);
          index > 0 ? newNode.getComponent("Barrier").init(0) : newNode.getComponent("Barrier").init(1);
        }
      },
      getNewBarrierPositon: function getNewBarrierPositon(barrier_temp, index, circulNum) {
        barrier_temp.y = this.leftPos.getPositionY();
        if (circulNum <= 1) {
          var randomNum = Math.floor(10 * Math.random() + 1);
          barrier_temp.x = randomNum <= 5 ? this.leftPos.getPositionX() : this.rightPos.getPositionX();
        } else barrier_temp.x = 0 == index ? this.leftPos.getPositionX() : this.rightPos.getPositionX();
        return cc.v2(barrier_temp.x, barrier_temp.y);
      },
      barrierDied: function barrierDied(nodeinfo, score) {
        D.common.backObjPool(this, nodeinfo);
      },
      pauseAction: function pauseAction() {
        this.pauseSpeed = D.barrierSpeed;
        D.barrierSpeed = 0;
      },
      resumeAction: function resumeAction() {
        D.barrierSpeed = this.pauseSpeed;
      }
    });
    cc._RF.pop();
  }, {} ],
  Barrier: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "624e2m97Z1P/La8zQXJBh4T", "Barrier");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        barrier_list: [],
        barrier_prafab: [ cc.Prefab ],
        maxMoveSpeed: 8
      },
      onLoad: function onLoad() {
        this.pauseSpeed = 0;
        this.gameStateBool = true;
        this.barrier = this.node.parent.getComponent("BarrierPool");
        this.aa = 0;
        this.circulNum = -1;
      },
      init: function init(num) {
        this.aa = 0;
        this.circulNum = num;
      },
      update: function update(dt) {
        this.node.y -= D.barrierSpeed;
        var winSize = cc.director.getWinSize();
        var last_barrier_bounding_box = this.node.getBoundingBox();
        var right_y = last_barrier_bounding_box.y + last_barrier_bounding_box.height;
        right_y = this.node.convertToWorldSpaceAR(right_y);
        var randomNum = 0;
        while (randomNum < 5 || randomNum > 8) randomNum = 10 * Math.random();
        if (right_y.y < winSize.height * randomNum / 10 && 0 == this.aa && 1 == this.circulNum) {
          this.aa = 1;
          this.barrier.getNewBarrier();
        }
        D.barrierSpeed < this.maxMoveSpeed && 0 != D.barrierSpeed;
        right_y.y < 0 && this.barrier.barrierDied(this.node, 0);
      }
    });
    cc._RF.pop();
  }, {} ],
  Bg: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "acf06FNDj1NDKU0heYWFweE", "Bg");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        bg: [ cc.Node ],
        speed: .5
      },
      onLoad: function onLoad() {
        this.fixBgPos(this.bg);
        var touchReceiver = cc.Canvas.instance.node;
        this.pauseSpeed = 0;
      },
      fixBgPos: function fixBgPos(bgList) {
        bgList[0].x = 0;
        var bg1BoundingBox = bgList[0].getBoundingBox();
        for (var index = 1; index < bgList.length; index++) {
          var element = bgList[index];
          element.setPosition(bg1BoundingBox.xMin, bg1BoundingBox.yMax * index);
        }
      },
      pauseAction: function pauseAction() {
        this.pauseSpeed = this.speed;
        this.speed = 0;
      },
      resumeAction: function resumeAction() {
        this.speed = this.pauseSpeed;
      },
      update: function update(dt) {
        this.bgMove(this.bg, this.speed);
        this.checkBgReset(this.bg);
      },
      bgMove: function bgMove(bgList, bgSpeed) {
        for (var index = 0; index < bgList.length; index++) {
          var element = bgList[index];
          element.y -= bgSpeed;
        }
      },
      checkBgReset: function checkBgReset(bgList) {
        var first_yMax = bgList[0].getBoundingBox().yMax;
        if (first_yMax <= 0) {
          var preFirstBg = bgList.shift();
          bgList.push(preFirstBg);
          var curFirstBg = bgList[0];
          preFirstBg.y = curFirstBg.getBoundingBox().yMax + curFirstBg.getBoundingBox().height * (this.bg.length - 2);
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  Common: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f7b04Hu7f9LNaKyKjf44Z3R", "Common");
    "use strict";
    var gameState = cc.Enum({
      none: 0,
      start: 1,
      pause: 2
    });
    var common = cc.Class({
      extends: cc.Component,
      properties: {},
      statics: {
        gameState: gameState
      },
      onLoad: function onLoad() {
        D.commonInfo = common;
        D.common = this;
      },
      batchInitObjPool: function batchInitObjPool(thisO, objArray) {
        for (var index = 0; index < objArray.length; index++) {
          var objinfo = objArray[index];
          this.initObjPool(thisO, objinfo);
        }
      },
      initObjPool: function initObjPool(thisO, objInfo) {
        var name = objInfo.name;
        var poolName = name + "Pool";
        thisO[poolName] = new cc.NodePool();
        var initPollCount = objInfo.initPollCount;
        for (var ii = 0; ii < initPollCount; ++ii) {
          var nodeO = cc.instantiate(objInfo.prefab);
          thisO[poolName].put(nodeO);
        }
      },
      genNewNode: function genNewNode(pool, prefab, nodeParent) {
        var newNode = null;
        newNode = pool.size() > 0 ? pool.get() : cc.instantiate(prefab);
        nodeParent.addChild(newNode);
        return newNode;
      },
      backObjPool: function backObjPool(thisO, nodeinfo) {
        var poolName = nodeinfo.name + "Pool";
        thisO[poolName].put(nodeinfo);
      },
      timeFmt: function timeFmt(time, fmt) {
        var o = {
          "M+": time.getMonth() + 1,
          "d+": time.getDate(),
          "h+": time.getHours(),
          "m+": time.getMinutes(),
          "s+": time.getSeconds(),
          "q+": Math.floor((time.getMonth() + 3) / 3),
          S: time.getMilliseconds()
        };
        /(y+)/.test(fmt) && (fmt = fmt.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length)));
        for (var k in o) new RegExp("(" + k + ")").test(fmt) && (fmt = fmt.replace(RegExp.$1, 1 == RegExp.$1.length ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
      }
    });
    cc._RF.pop();
  }, {} ],
  Globals: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "04ef803gaBLj5NO25iXF60L", "Globals");
    "use strict";
    window.D = {
      common: null,
      commonInfo: null,
      barrierSpeed: 10,
      gameState: 0
    };
    cc._RF.pop();
  }, {} ],
  Player: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b1f8f2Q0kBMl5otkV6OnZxY", "Player");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        moveDiastance: 50,
        Left_node: {
          default: null,
          type: cc.Node
        },
        Right_node: {
          default: null,
          type: cc.Node
        }
      },
      onLoad: function onLoad() {
        this.manager = cc.director.getCollisionManager();
        this.manager.enabled = true;
        this.node.parent.zIndex = 2;
        this.touchPos = 0;
        this.right_lock = false;
        this.left_lock = true;
        this.up_lock = true;
        this.down_lock = true;
        this.player = this.node.getComponent(cc.Animation);
        var touchReceiver = cc.Canvas.instance.node;
        touchReceiver.on("touchmove", this.onTouchMove, this);
        touchReceiver.on("touchstart", this.onTouchStart, this);
        touchReceiver.on("touchend", this.onTouchEnd, this);
      },
      onDestroy: function onDestroy() {
        var touchReceiver = cc.Canvas.instance.node;
        touchReceiver.off("touchmove", this.onTouchMove, this);
        touchReceiver.off("touchstart", this.onTouchStart, this);
        touchReceiver.off("touchend", this.onTouchEnd, this);
      },
      getDistance: function getDistance(pos1, pos2) {
        return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
      },
      getDistanceY: function getDistanceY(pos1, pos2) {
        return pos1.y - pos2.y;
      },
      getDistanceX: function getDistanceX(pos1, pos2) {
        return pos1.x - pos2.x;
      },
      getAngle: function getAngle(pos1, pos2) {
        this._angle = Math.atan2(pos1.y - pos2.y, pos1.x - pos2.x) * (180 / Math.PI);
        return this._angle;
      },
      closeUpLock: function closeUpLock() {
        this.up_lock = true;
      },
      closeDownLock: function closeDownLock() {
        this.down_lock = true;
        this.node.parent.zIndex = 2;
      },
      onCollisionStay: function onCollisionStay(other) {
       // cc.log("this.down_lock,,,,,", this.down_lock);
        1 == other.tag || (2 == other.tag && this.down_lock ? cc.log("2222222222", other) : 3 == other.tag);
      },
      onTouchStart: function onTouchStart(event) {
        this.lock = true;
        this.touchPos = event.getLocation();
      },
      onTouchMove: function onTouchMove(event) {
        var touchLoc = event.getLocation();
        var distanceX = this.getDistanceX(touchLoc, this.touchPos);
        var distanceY = this.getDistanceY(touchLoc, this.touchPos);
        var angle = this.getAngle(touchLoc, this.touchPos);
        if (this.lock && Math.abs(distanceX) > this.node.getContentSize().width / 4 && (angle < 45 && angle > -45 || angle > 135 || angle < -135)) {
          if (distanceX > 0) {
            if (this.right_lock) {
              this.node.runAction(cc.moveBy(.2, 360, 0));
              this.right_lock = false;
              this.left_lock = true;
              this.up_lock && this.down_lock && this.player.playAdditive("HorizontalRight");
            }
          } else if (this.left_lock) {
            this.left_lock = false;
            this.right_lock = true;
            this.node.runAction(cc.moveBy(.2, -360, 0));
            this.up_lock && this.down_lock && this.player.playAdditive("HorizontalLeft");
          }
          this.lock = false;
        }
        if (this.lock && Math.abs(distanceY) > this.node.getContentSize().height / 4 && (angle >= 45 && angle <= 135 || angle <= -45 && angle >= -135)) {
          if (distanceY > 0) {
            this.up_lock = false;
            this.player.playAdditive("JumpUp");
          } else {
            this.node.parent.zIndex = 1;
            this.down_lock = false;
            this.player.playAdditive("JumpDown");
          }
          this.lock = false;
        }
      },
      onTouchEnd: function onTouchEnd(event) {
        this.accLeft = false;
        this.accRight = false;
      }
    });
    cc._RF.pop();
  }, {} ]
}, {}, [ "Barrier", "BarrierPool", "Bg", "Common", "Globals", "Player" ]);
