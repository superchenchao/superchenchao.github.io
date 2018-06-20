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
  Barrier_pool: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fe2baZbWY5K0pb72z8KZUfh", "Barrier_pool");
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
          }
        };
      },
      onLoad: function onLoad() {
        this.pauseSpeed = 0;
        this.eState = D.commonInfo.gameState.start;
        D.common.batchInitObjPool(this, this.barrierG);
        this.getNewBarrier();
      },
      getNewBarrier: function getNewBarrier() {
        var ei = 3 * Math.random();
        ei = Math.floor(ei);
        var poolName = this.barrierG[ei].name + "Pool";
        var newNode = D.common.genNewNode(this[poolName], this.barrierG[ei].prefab, this.node);
        cc.log("生成障碍物。。。。。。。。。。", newNode);
        var newV2 = this.getNewBarrierPositon(newNode);
        newNode.setPosition(newV2);
        newNode.getComponent("OnlyBarrier").init();
      },
      getNewBarrierPositon: function getNewBarrierPositon(barrier_temp) {
        var layer_size = this.node.getContentSize();
        barrier_temp.y = layer_size.height;
        barrier_temp.x = Math.random() * (layer_size.width - barrier_temp.getContentSize().width);
        return cc.v2(barrier_temp.x, barrier_temp.y);
      },
      randomBarrier: function randomBarrier() {
        var random_num = 3 * Math.random();
        random_num = Math.floor(random_num);
        var barrier_temp = cc.instantiate(this.barrier_prafab[random_num]);
        barrier_temp.setAnchorPoint(0, 0);
        return barrier_temp;
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
    cc._RF.push(module, "5eda36iU7ZJJ4vlW+NITWDZ", "Barrier");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        barrier_list: [],
        move_speed: .1,
        barrier_prafab: [ cc.Prefab ],
        maxMoveSpeed: 8
      },
      onLoad: function onLoad() {
        console.log("barrter onload..............");
        for (var index = 0; index < Math.random(2, 5); index++) this.generate();
        this.pauseSpeed = 0;
        this.gameStateBool = true;
      },
      randomBarrier: function randomBarrier() {
        var random_num = 3 * Math.random();
        random_num = Math.floor(random_num);
        var barrier_temp = cc.instantiate(this.barrier_prafab[random_num]);
        barrier_temp.setAnchorPoint(0, 0);
        return barrier_temp;
      },
      generate: function generate() {
        var barrier_temp = this.randomBarrier();
        var layer_size = this.node.getContentSize();
        barrier_temp.y = layer_size.height;
        barrier_temp.x = Math.random() * (layer_size.width - barrier_temp.getContentSize().width);
        cc.log("layer_size:::::::::", layer_size.width);
        cc.log("barrier_temp:::::::::", barrier_temp.x);
        this.barrier_list.push(barrier_temp);
        this.node.addChild(barrier_temp);
      },
      pauseAction: function pauseAction() {
        this.pauseSpeed = this.move_speed;
        this.move_speed = 0;
        this.gameStateBool = false;
      },
      resumeAction: function resumeAction() {
        this.move_speed = this.pauseSpeed;
        this.gameStateBool = true;
      },
      update: function update(dt) {
        var barrier;
        var remove_count = 0;
        var list_new = [];
        for (var index = 0; index < this.barrier_list.length; index++) {
          barrier = this.barrier_list[index];
          barrier.y -= this.move_speed;
          barrier.getBoundingBox().yMax > 0 ? list_new.push(barrier) : barrier.removeFromParent();
        }
        this.barrier_list = list_new;
        if (!barrier) return;
        var winSize = cc.director.getWinSize();
        var last_barrier_bounding_box = barrier.getBoundingBox();
        var right_y = last_barrier_bounding_box.y + last_barrier_bounding_box.height;
        var randomNum = 0;
        while (randomNum < 5 || randomNum > 7) randomNum = 10 * Math.random();
        right_y < winSize.height * randomNum / 10 && this.generate();
        this.move_speed < this.maxMoveSpeed && this.gameStateBool && (this.move_speed += .001);
        module.exports.barrierSpeed = this.move_speed;
      }
    });
    cc._RF.pop();
  }, {} ],
  Boom: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ee5b7jXJ/9B2bk9hQ43J84M", "Boom");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        speed: 10,
        horizontalBar: {
          type: cc.ProgressBar,
          default: null
        }
      },
      onLoad: function onLoad() {
        var ani = this.getComponent(cc.Animation);
        var a = ani.play("small");
        a.wrapMode = cc.WrapMode.Loop;
      },
      update: function update(dt) {},
      _updateProgressBar: function _updateProgressBar(progressBar, dt) {}
    });
    cc._RF.pop();
  }, {} ],
  Common: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3468d5EP01Ki5KAMO4tUyQI", "Common");
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
        cc.log("pool.size()..........", pool);
        var newNode = null;
        newNode = pool.size() > 0 ? pool.get() : cc.instantiate(prefab);
        cc.log("newNode,,,,,,,,,,,", newNode);
        nodeParent.addChild(newNode);
        cc.log("oooooooooooooooooooooo");
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
  Game: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ba557xEiPBEcZnegJTZDQno", "Game");
    "use strict";
    var Player = require("player");
    var Barrier = require("Barrier_pool");
    var background = require("background");
    cc.Class({
      extends: cc.Component,
      properties: {
        player: {
          default: null,
          type: Player
        },
        barrier: {
          default: null,
          type: Barrier
        },
        bg: {
          default: null,
          type: background
        },
        gameOver: {
          default: null,
          type: cc.Node
        },
        btn_start: {
          default: null,
          type: cc.Node
        },
        btn_score: {
          default: null,
          type: cc.Node
        },
        score: {
          default: null,
          type: cc.Label
        },
        reset_barrierSpeed: 0,
        btn_pause: {
          default: null,
          type: cc.Node
        }
      },
      onLoad: function onLoad() {
        this.gameOverAni = this.gameOver.getComponent(cc.Animation);
        this.pasueFrame = this.btn_pause.getComponent(cc.Sprite);
        this.enabled = true;
        this.pauseSure = false;
        this.scoreNum = 0;
        D.gameState = D.commonInfo.gameState.start;
        D.barrierSpeed = this.reset_barrierSpeed;
      },
      pauseClick: function pauseClick() {
        if (D.gameState == D.commonInfo.gameState.pause) {
          this.resumeAction();
          D.gameState = D.commonInfo.gameState.start;
        } else if (D.gameState == D.commonInfo.gameState.start) {
          this.pauseAction();
          D.gameState = D.commonInfo.gameState.pause;
        }
      },
      resumeAction: function resumeAction() {
        this.pasueFrame.spriteFrame.setTexture(cc.url.raw("resources/operation/btn_pause.png"));
        this.player.resumeAction();
        this.barrier.resumeAction();
        this.bg.resumeAction();
        this.pauseSure = false;
      },
      pauseAction: function pauseAction() {
        this.pasueFrame.spriteFrame.setTexture(cc.url.raw("resources/operation/btn_continue.png"));
        this.player.pauseAction();
        this.barrier.pauseAction();
        this.bg.pauseAction();
        this.pauseSure = true;
      },
      onStartGame: function onStartGame() {
        this.enabled = true;
        this.player.node.active = true;
        this.player.gameOver = false;
        this.player.node.setPosition(this.player.playerPos);
        this.gameOver.active = false;
        this.btn_start.active = false;
        this.btn_score.active = false;
        this.player.manager.enabled = true;
        D.barrierSpeed = this.reset_barrierSpeed;
        this.barrier.getNewBarrier();
        this.scoreNum = 0;
        this.pasueFrame.spriteFrame.setTexture(cc.url.raw("resources/operation/btn_pause.png"));
        D.gameState = D.commonInfo.gameState.start;
        this.pauseSure = false;
        this.player.resumeAction();
        this.bg.resumeAction();
      },
      updateScore: function updateScore() {
        var currentScore = this.score.string;
        var scoreData = {
          score: currentScore,
          time: D.common.timeFmt(new Date(), "yyyy-MM-dd hh:mm:ss")
        };
        var preData = cc.sys.localStorage.getItem("score");
        var preTopScore = cc.sys.localStorage.getItem("topScore");
        (!preTopScore || parseInt(preTopScore) < parseInt(currentScore)) && cc.sys.localStorage.setItem("topScore", currentScore);
        if (preData) {
          preData = JSON.parse(preData);
          preData instanceof Array || (preData = []);
          preData.unshift(scoreData);
        } else {
          preData = [];
          preData.unshift(scoreData);
        }
        cc.log("储存分数。，，，，，", preData);
        cc.sys.localStorage.setItem("currentScore", currentScore);
        cc.sys.localStorage.setItem("score", JSON.stringify(preData));
      },
      gotoHistoryScore: function gotoHistoryScore() {
        cc.director.loadScene("historyScore");
      },
      update: function update(dt) {
        if (2 != D.gameState) {
          this.scoreNum++;
          this.score.string = this.scoreNum + "";
        }
        if (this.player.gameOver) {
          this.enabled = false;
          this.gameOver.active = true;
          this.btn_start.active = true;
          this.btn_score.active = true;
          this.gameOverAni.play("gameover");
          this.barrier.pauseAction();
          this.bg.pauseAction();
          this.updateScore();
          cc.director.preloadScene("historyScore");
          D.gameState = D.commonInfo.gameState.none;
        }
      }
    });
    cc._RF.pop();
  }, {
    Barrier_pool: "Barrier_pool",
    background: "background",
    player: "player"
  } ],
  Globals: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d0688DGpfNDOI7XujC+i7is", "Globals");
    "use strict";
    window.D = {
      common: null,
      commonInfo: null,
      barrierSpeed: 4,
      gameState: 0
    };
    cc._RF.pop();
  }, {} ],
  OnlyBarrier: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "957e26DF1JMsZb8wuyxi5F6", "OnlyBarrier");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        barrier_list: [],
        barrier_prafab: [ cc.Prefab ],
        maxMoveSpeed: 8
      },
      onLoad: function onLoad() {
        console.log("barrter onload..............");
        this.pauseSpeed = 0;
        this.gameStateBool = true;
        this.barrier = this.node.parent.getComponent("Barrier_pool");
        this.aa = 0;
      },
      init: function init() {
        this.aa = 0;
        cc.log("init,,,,,,,,,,,,,,,,");
      },
      update: function update(dt) {
        cc.log("D.barrierSpeed.......", D.barrierSpeed);
        this.node.y -= D.barrierSpeed;
        var winSize = cc.director.getWinSize();
        var last_barrier_bounding_box = this.node.getBoundingBox();
        var right_y = last_barrier_bounding_box.y + last_barrier_bounding_box.height;
        var randomNum = 0;
        while (randomNum < 5 || randomNum > 7) randomNum = 10 * Math.random();
        if (right_y < winSize.height * randomNum / 10 && 0 == this.aa) {
          this.aa = 1;
          this.barrier.getNewBarrier();
        }
        D.barrierSpeed < this.maxMoveSpeed && 0 != D.barrierSpeed && (D.barrierSpeed += .001);
        (this.node.y < 0 || 0 == D.gameState) && this.barrier.barrierDied(this.node, 0);
      }
    });
    cc._RF.pop();
  }, {} ],
  ProgressBar: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6d42754PCBF+JLiwrnP4rtI", "ProgressBar");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        speed: 10,
        bar: {
          type: cc.ProgressBar,
          default: null
        }
      },
      onLoad: function onLoad() {
        cc.log("lllllll");
        this.bar.progress = 0;
      },
      update: function update(dt) {
        this._updateProgressBar(this.bar, dt);
      },
      _updateProgressBar: function _updateProgressBar(progressBar, dt) {
        var pro = progressBar.progress;
        pro < 1 && (pro += dt * this.speed);
        cc.log("pro", pro);
        progressBar.progress = pro;
      }
    });
    cc._RF.pop();
  }, {} ],
  Prop: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8e208SVw5ZONqrEk3Fowwfw", "Prop");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {}
    });
    cc._RF.pop();
  }, {} ],
  ScoreItemTemplate: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "bec64gyk+JALLTabH82yYHy", "ScoreItemTemplate");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        itemScore: cc.Label,
        itemTime: cc.Label
      },
      onLoad: function onLoad() {},
      init: function init(data) {
        this.itemScore.string = "积分：" + data.score;
        this.itemTime.string = "时间：" + data.time;
      }
    });
    cc._RF.pop();
  }, {} ],
  background: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8a6cat1cT9HeY9odaBhIo/8", "background");
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
        this.bgMove(this.bg, D.barrierSpeed);
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
          preFirstBg.y = 8 * curFirstBg.getBoundingBox().yMax + 4 * D.barrierSpeed;
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  historyScore: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "414e5mPSDJEcKa8Zn5qNm0z", "historyScore");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        itemPrefab: cc.Prefab,
        scrollContent: cc.Node,
        backGame: cc.Node
      },
      onLoad: function onLoad() {
        var infoData = JSON.parse(cc.sys.localStorage.getItem("score"));
        cc.log("historyScore_infoData,,,,,,,,,,", infoData);
        for (var i = 0; i < infoData.length; ++i) {
          var item = cc.instantiate(this.itemPrefab);
          var data = infoData[i];
          this.scrollContent.addChild(item);
          item.getComponent("ScoreItemTemplate").init({
            score: data.score,
            time: data.time
          });
        }
        this.backGame.on("touchstart", this.backGameO, this);
      },
      backGameO: function backGameO() {
        cc.director.loadScene("game");
      }
    });
    cc._RF.pop();
  }, {} ],
  player: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "98288OK94hHao3wWH+JiSRJ", "player");
    "use strict";
    var barrier = require("OnlyBarrier");
    cc.Class({
      extends: cc.Component,
      properties: {
        accel: 0,
        maxMoveSpeed: 0
      },
      onLoad: function onLoad() {
        this.manager = cc.director.getCollisionManager();
        this.manager.enabled = true;
        this.gameOver = false;
        this.playerPos = this.node.getPosition();
        this.collisionX = 0;
        this.collisionY = 0;
        this.accLeft = false;
        this.accRight = false;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.player = this.node.getComponent(cc.Animation);
        var touchReceiver = cc.Canvas.instance.node;
        this.onDrag();
      },
      onDrag: function onDrag() {
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.dragMove, this.node);
      },
      offDrag: function offDrag() {
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.dragMove, this.node);
      },
      dragMove: function dragMove(event) {
        var delta = event.touch.getDelta();
        this.x += delta.x;
      },
      onDestroy: function onDestroy() {
        var touchReceiver = cc.Canvas.instance.node;
        touchReceiver.off("touchstart", this.onTouchStart, this);
        touchReceiver.off("touchend", this.onTouchEnd, this);
        this.offDrag();
        cc.director.getCollisionManager().enabled = false;
        cc.director.getCollisionManager().enabledDebugDraw = false;
      },
      onTouchStart: function onTouchStart(event) {
        console.log("触摸开始，，，，，，，，，，，，，");
        var touchLoc = event.getLocation();
        if (touchLoc.x >= cc.winSize.width / 2) {
          this.node.x += 20;
          this.accLeft = false;
          this.accRight = true;
        } else {
          this.node.x -= 20;
          this.accLeft = true;
          this.accRight = false;
        }
      },
      onTouchEnd: function onTouchEnd(event) {
        this.accLeft = false;
        this.accRight = false;
      },
      onCollisionEnter: function onCollisionEnter(other, self) {
        1 == other.tag ? this.collisionMudEnter(other, self) : 2 == other.tag ? this.collisionNailEnter(other, self) : this.collisionSpringEnter(other, self);
      },
      collisionSpringEnter: function collisionSpringEnter(other, self) {
        cc.log("弹簧碰撞。。。。。。。。。。。。。。");
        var selfAabb = self.world.aabb.clone();
        var otherAabb = other.world.aabb;
        var preAabb = self.world.preAabb;
        selfAabb.x = preAabb.x;
        selfAabb.y = preAabb.y;
        selfAabb.y = self.world.aabb.y;
        if (cc.Intersection.rectRect(selfAabb, otherAabb)) {
          if (selfAabb.yMax > otherAabb.yMax) {
            this.node.y = otherAabb.yMax;
            this.collisionY = -1;
          } else if (selfAabb.yMin < otherAabb.yMin) {
            cc.log("barrier---------------", D.barrierSpeed);
            cc.log("selfAabb.height..........", selfAabb.height);
            cc.log("this.node.height............", this.node.getContentSize().height);
            this.player.play("shape");
            this.node.y = otherAabb.yMin - selfAabb.height - 60 * D.barrierSpeed;
            this.collisionY = 1;
            this.node.y < 0 && this.playerMiss();
          }
          return;
        }
        this.checkXCollision(selfAabb, self, otherAabb);
      },
      collisionNailEnter: function collisionNailEnter(other, self) {
        cc.log("闪电碰撞。。。。。。。。。。。。。。");
        var selfAabb = self.world.aabb.clone();
        var otherAabb = other.world.aabb;
        var preAabb = self.world.preAabb;
        selfAabb.x = preAabb.x;
        selfAabb.y = preAabb.y;
        selfAabb.y = self.world.aabb.y;
        if (cc.Intersection.rectRect(selfAabb, otherAabb)) {
          if (selfAabb.yMax > otherAabb.yMax) {
            this.node.y = otherAabb.yMax;
            this.collisionY = -1;
          } else if (selfAabb.yMin < otherAabb.yMin) {
            cc.log("barrier---------------", D.barrierSpeed);
            this.playerMiss();
            this.collisionY = 1;
          }
          return;
        }
        this.checkXCollision(selfAabb, self, otherAabb);
      },
      playerMiss: function playerMiss() {
        cc.log("这么快就死了。。。。。。。");
        cc.director.getCollisionManager().enabled = false;
        this.player.play("boom");
        this.scheduleOnce(function() {
          this.node.active = false;
          this.gameOver = true;
        }, .5);
      },
      collisionMudEnter: function collisionMudEnter(other, self) {
        cc.log("土墙碰撞。。。。。。。。。。。。。。");
        var selfAabb = self.world.aabb.clone();
        var otherAabb = other.world.aabb;
        var preAabb = self.world.preAabb;
        selfAabb.x = preAabb.x;
        selfAabb.y = preAabb.y;
        selfAabb.y = self.world.aabb.y;
        if (cc.Intersection.rectRect(selfAabb, otherAabb)) {
          if (selfAabb.yMax > otherAabb.yMax) {
            this.node.y = otherAabb.yMax;
            this.collisionY = -1;
          } else if (selfAabb.yMin < otherAabb.yMin) {
            cc.log("barrier---------------", D.barrierSpeed);
            cc.log("selfAabb.height..........", selfAabb.height);
            cc.log("this.node.height............", this.node.getContentSize().height);
            this.node.y = otherAabb.yMin - selfAabb.height - 2 * D.barrierSpeed;
            this.collisionY = 1;
            this.node.y < 0 && this.playerMiss();
          }
          return;
        }
        this.checkXCollision(selfAabb, self, otherAabb);
      },
      checkXCollision: function checkXCollision(selfAabb, self, otherAabb) {
        selfAabb.x = self.world.aabb.x;
        cc.log("otherAabb.xMin----------", otherAabb.xMin);
        cc.log("otherAabb.xMax----------", otherAabb.xMax);
        if (cc.Intersection.rectRect(selfAabb, otherAabb)) {
          if (selfAabb.xMax > otherAabb.xMax) {
            this.node.x = this.node.parent.width - this.node.getContentSize().width;
            this.collisionX = -1;
          } else if (selfAabb.xMin < otherAabb.xMin) {
            this.node.x = 0;
            this.collisionX = 1;
          }
          cc.log("collisionMudEnter this.collisionX", this.collisionX);
          this.xSpeed = 0;
          return;
        }
      },
      onCollisionExit: function onCollisionExit(other, self) {
        console.log("on collision exit", other.tag);
        this.collisionX = 0;
        this.collisionY = 0;
      },
      pauseAction: function pauseAction() {
        this.offDrag();
      },
      resumeAction: function resumeAction() {
        this.onDrag();
      },
      update: function update(dt) {
        this.accLeft ? this.xSpeed -= this.accel * dt : this.accRight && (this.xSpeed += this.accel * dt);
        Math.abs(this.xSpeed) > this.maxMoveSpeed && (this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed));
        this.accLeft || this.accRight || (this.xSpeed = 0);
        this.xSpeed * this.collisionX > 0 && (this.xSpeed = 0);
        this.node.x += this.xSpeed * dt;
        var screenWidth = this.node.getContentSize().width;
        if (this.node.x > this.node.parent.width - screenWidth) {
          this.node.x = this.node.parent.width - screenWidth;
          this.xSpeed = 0;
        } else if (this.node.x < 0) {
          this.node.x = 0;
          this.xSpeed = 0;
        }
      }
    });
    cc._RF.pop();
  }, {
    OnlyBarrier: "OnlyBarrier"
  } ]
}, {}, [ "Barrier", "Barrier_pool", "Boom", "Common", "Game", "Globals", "OnlyBarrier", "ProgressBar", "Prop", "ScoreItemTemplate", "background", "historyScore", "player" ]);