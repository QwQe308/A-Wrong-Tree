addLayer("p", { //这是代码中的节点代码 例如player.p可以调用该层级的数据 尽量使用顺手的字母什么的 不建议数字开头
    symbol: "P", // 这是节点上显示的字母
    position: 0, // 节点顺序
    startData() { return {
        unlocked: true, //是否开始就解锁
		points: new ExpantaNum(0),
        e:n(0),
    }},
    color: "lime",
    resource: "重置点", // 重置获得的资源名称
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    requires(){return new ExpantaNum(10)},
    exponent:0.25,
    baseAmount(){return player.points},//基础资源数量
    baseResource:"点数",//基础资源名称
    gainMult() { // 资源获取数量倍率
        mult = new ExpantaNum(1)
        var upgID = [14,15]
	    for(i in upgID){
		    i = upgID[i]
		    if(hasUpgrade("p",i)) mult = mult.mul(upgradeEffect("p",i))
	    }
        if(hasUpgrade("p",32)) mult = mult.mul(layers.p.effect())
        return mult
    },
    gainExp() { // 资源获取指数加成(与exponent相乘)
        var exp = new ExpantaNum(1)
        if(hasUpgrade("p",22)) exp = exp.mul(upgradeEffect("p",22).add(1))
        return exp
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)  QwQ:1也可以当第一排
    layerShown(){return true},
    effectDescription(){return `
        这是一个集合了很多劝退方法的树.如果你玩不下去,那简直太正常了.这个树的主要目的是为了防止群友作者继续踩坑.(不是<br>
        每一个劝退方法持续到有文字说明其结束.<br>
        1.开局资源获取指数太低,导致挂机收益极低. 3.在此基础上没有快捷键和手机qol.
        ${hasUpgrade("p",32)?`<br><br>重置能量:${format(player.p.e)},使得重置点获取*${format(this.effect())}`:``}
        `},
    effect(){
        var eff = player.p.e.div(10).add(1).pow(2)
        return eff
    },
    upgrades:{
        11:{
            description:`2.已经出现过无数遍的平淡开局.重置点加成点数.`,
            effect(){
                var eff = player.p.points.add(1).pow(0.5)
                if(hasUpgrade("p",21)) eff = eff.mul(upgradeEffect("p",21).add(1))
                var buyablePow = n(1)
                buyablePow = hasUpgThenAdd(buyablePow,this.layer,31)
                eff = eff.mul(buyableEffect("p",11).pow(buyablePow))
                return eff
            },
            effectDisplay(){return `x ${format(this.effect())}`},
            cost:n(1),
        },
        12:{
            description:`点数加成自身.`,
            effect(){
                var eff = player.points.add(1).log10().add(1)
                if((hasUpgrade("p",25) && !inChallenge("p",11)) || inChallenge("p",12)) eff = expPow(eff.mul(10),2).div(10)
                if(hasChallenge("p",12)) eff = eff.pow(challengeEffect("p",12))
                var buyablePow = n(1)
                buyablePow = hasUpgThenAdd(buyablePow,this.layer,31)
                eff = eff.mul(buyableEffect("p",11).pow(buyablePow))
                return eff
            },
            effectDisplay(){return `x ${format(this.effect())}`},
            cost:n(4),
            unlocked(){return hasUpgrade(this.layer,this.id-1)},
        },
        13:{
            description:`每个升级使点数*1.5.`,
            effect(){
                var base = n(1.5)
                base = hasUpgThenMul(base,"p",24)
                var eff = base.pow(player.p.upgrades.length)
                var buyablePow = n(1)
                buyablePow = hasUpgThenAdd(buyablePow,this.layer,31)
                eff = eff.mul(buyableEffect("p",11).pow(buyablePow))
                return eff
            },
            effectDisplay(){return `x ${format(this.effect())}`},
            cost:n(16),
            unlocked(){return hasUpgrade(this.layer,this.id-1)},
        },
        14:{
            description:`重置点加成重置点.劝退3结束.`,
            effect(){
                var eff = player.p.points.div(16).add(1).cbrt()
                var buyablePow = n(1)
                buyablePow = hasUpgThenAdd(buyablePow,this.layer,31)
                eff = eff.mul(buyableEffect("p",11).pow(buyablePow))
                return eff
            },
            effectDisplay(){return `x ${format(this.effect())}`},
            cost:n(64),
            unlocked(){return hasUpgrade(this.layer,this.id-1)},
        },
        15:{
            description:`点数加成重置点.4.瞬间重置效益远不如等待一小会,并且重置量大.`,
            effect(){
                var eff = player.points.add(10).log10()
                if(hasUpgrade("p",31)) eff = expPow(eff.mul(10),2).div(10)
                var buyablePow = n(1)
                buyablePow = hasUpgThenAdd(buyablePow,this.layer,31)
                eff = eff.mul(buyableEffect("p",11).pow(buyablePow))
                return eff
            },
            effectDisplay(){return `x ${format(this.effect())}`},
            cost:n(256),
            unlocked(){return hasUpgrade(this.layer,this.id-1)},
        },
        21:{
            description:`6.过多/过强的升级成为仅有的增长方式,且游戏内容变化小时会造成很明显的时间墙.升级11效果+^0.2.`,
            effect(){
                var eff = n(0.2)
                eff = eff.mul(buyableEffect("p",11))
                return eff.min(1)
            },
            effectDisplay(){return `+^ ${format(this.effect())}(硬上限:+^0.5)`},
            cost:n(10086),
            unlocked(){return hasUpgrade(this.layer,15)&&isUnl(1)},
        },
        22:{
            description:`劝退1结束.p重置点获取指数+*0.25.`,
            effect(){
                var eff = n(0.25)
                eff = eff.mul(buyableEffect("p",11))
                return eff.min(1)
            },
            effectDisplay(){return `+* ${format(this.effect())}(硬上限:+*0.5)`},
            cost:n(23333),
            unlocked(){return hasUpgrade(this.layer,this.id-1)},
        },
        23:{
            description:`7.在操作量小时,挑战会完全变成时间墙.解锁一个挑战.`,
            effect(){
                if(!hasUpgrade(this.layer,this.id)) return n(0)
                var eff = n(1)
                eff = eff.mul(buyableEffect("p",11))
                return eff
            },
            effectDisplay(){return `解锁 ${format(this.effect())} 个挑战`},
            cost:n(666666),
            unlocked(){return hasUpgrade(this.layer,this.id-1)},
        },
        24:{
            description:`升级13的底数基于重置点被倍增.`,
            effect(){
                var eff = player.p.points.add(1).log10().div(10).add(1)
                eff = eff.mul(buyableEffect("p",11))
                return eff
            },
            effectDisplay(){return `x${format(this.effect())}`},
            cost:n(1e6),
            unlocked(){return hasUpgrade(this.layer,this.id-1)},
        },
        25:{
            description:`解锁一个可重复购买项.升级12被大幅加成(指数^2,c1挑战内不触发该加强).`,
            effect(){
                if(!hasUpgrade(this.layer,this.id)) return n(0)
                var eff = n(1)
                eff = eff.mul(buyableEffect("p",11))
                return eff
            },
            effectDisplay(){return `解锁 ${format(this.effect())} 个购买项`},
            cost:n(1e8),
            unlocked(){return hasUpgrade(this.layer,this.id-1)},
        },
        31:{
            description:`加强升级15.前五个升级被购买项加成时,效果+^1.`,
            effect(){
                var eff = n(1)
                return eff
            },
            effectDisplay(){return `+^ ${format(this.effect())}`},
            cost:n(1e18),
            unlocked(){return hasUpgrade(this.layer,25)&&isUnl(1)},
        },
        32:{
            description:`解锁重置能量.重置能量每秒获取量为:重置点^(1/20)/1000`,
            effect(){
                var eff = player.points.pow(0.05).div(1000)
                eff = eff.mul(buyableEffect("p",12))
                return eff
            },
            effectDisplay(){return `+ ${format(this.effect())}/s`},
            cost:n(1e55),
            unlocked(){return hasUpgrade(this.layer,this.id-1)},
        },
    },
    update(diff){
        if(hasUpgrade("p",32)) player.p.e = player.p.e.add(upgradeEffect("p",32).mul(diff))
    },
    doReset(l){
        if(layers[l].row<=this.row) return
        layerDataReset(this.layer)
    },
    clickables: {
        11: {
            canClick(){return true},
            display() {return `长按以重置(手机端qol)`},
            onHold(){
                doReset(this.layer)
            },
            unlocked(){return hasUpgrade('p', 14)},
        },
    },
    challenges:{
        11:{
            name: "C-1",
            challengeDescription: "升级12效果反转.(无论是否有升级12)",
            rewardDescription:"每秒自动获取10%的重置点 8.在内容不多且操作量本身就小时,给予过多的qol和自动化.劝退4结束.",
            goalDescription:"获得1e6点数",
            canComplete(){return player.points.gte(1e6)},
            unlocked(){return hasUpgrade("p",23)},
        },
        12:{
            name: "C-2",
            challengeDescription: "加强后的升级12效果反转.(无论是否有升级12,加强后),进入挑战会让你的重置点清零.Tips:携带足够的重置能量进入.",
            rewardDescription:"升级12效果再次基于点数被加成.",
            rewardEffect(){
                var eff = player.points.add(1).log10().add(1).log10().add(1)
                return eff
            },
            rewardDisplay(){return `^${format(this.rewardEffect())}`},
            goalDescription:"获得1e66点数",
            canComplete(){return player.points.gte(1e66)},
            unlocked(){return hasUpgrade("p",23)},
            onEnter(){player.p.points = n(0)},
        },
    },
    buyables:{
        11: {
            cost(x = getBuyableAmount(this.layer, this.id)) {
                var c = n(1e11).mul(n(1e3).pow(x)).mul(n(4).pow(x.pow(2)))
                return c
            },
            display() { return `倍增前10个升级效果.<br />x${format(buyableEffect(this.layer,this.id),2)}.(下一级: ${format(this.effect(getBuyableAmount(this.layer, this.id).add(1)))})<br />费用:${format(this.cost(getBuyableAmount(this.layer, this.id)))}重置点<br>等级:${formatWhole(getBuyableAmount(this.layer, this.id))}` },
            canAfford() { return player.p.points.gte(this.cost()) },
            buy() {
                player.p.points = player.p.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x = getBuyableAmount(this.layer, this.id)){
                var eff = x.mul(1.5).add(1).root(4)
                return eff
            },
            unlocked(){return upgradeEffect("p",25).gte(1)},
        },
        12: {
            cost(x = getBuyableAmount(this.layer, this.id)) {
                var c = three.pow(x).mul(10)
                return c
            },
            display() { return `倍增重置能量.<br />x${format(buyableEffect(this.layer,this.id),2)}.(下一级: ${format(this.effect(getBuyableAmount(this.layer, this.id).add(1)))})<br />费用:${format(this.cost(getBuyableAmount(this.layer, this.id)))}重置能量<br>等级:${formatWhole(getBuyableAmount(this.layer, this.id))}` },
            canAfford() { return player.p.e.gte(this.cost()) },
            buy() {
                player.p.e = player.p.e.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x = getBuyableAmount(this.layer, this.id)){
                var eff = n(1.5).pow(x)
                return eff
            },
            unlocked(){return upgradeEffect("p",25).gte(2)},
        },
    },
    passiveGeneration(){
        if(hasChallenge("p",11)) return 0.1
        return 0
    },
    hotkeys: [
        {
            key: "p", // What the hotkey button is. Use uppercase if it's combined with shift, or "ctrl+x" for holding down ctrl.
            description: "p:P转", // The description of the hotkey that is displayed in the game's How To Play tab
            onPress() { if (player.p.unlocked) doReset("p") },
            unlocked() {return hasUpgrade('p', 14)} // Determines if you can use the hotkey, optional
        }
    ],
    getResetGain(){
        var gain = layers[this.layer].baseAmount().div(layers[this.layer].requires()).pow(layers[this.layer].exponent).pow(layers[this.layer].gainExp()).mul(layers[this.layer].gainMult())
        gain = gain.min(1.79e308)
        return gain.floor()
    },
})

var escReq = [1e6,1e18,1e200]
function isUnl(escPointsRequired){
    return player.esc.points.gte(escPointsRequired)
}

addLayer("esc", { //这是代码中的节点代码 例如player.p可以调用该层级的数据 尽量使用顺手的字母什么的 不建议数字开头
    symbol: `ESC`, // 这是节点上显示的字母
    position: 0, // 节点顺序
    startData() { return {
        unlocked: true, //是否开始就解锁
		points: new ExpantaNum(0),
    }},
    color: "grey",
    resource: "劝退点", // 重置获得的资源名称
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    requires(){
        if(escReq[player.esc.points.toNumber()]) return n(escReq[player.esc.points.toNumber()])
        return n(Infinity)
    },
    base:1,
    exponent:1,
    baseAmount(){return player.points},//基础资源数量
    baseResource:"点数",//基础资源名称
    gainMult() { // 资源获取数量倍率
        mult = new ExpantaNum(1)
        return mult
    },
    gainExp() { // 资源获取指数加成(与exponent相乘)
        var exp = new ExpantaNum(1)
        return exp
    },
    row: 9, // Row the layer is in on the tree (0 is the first row)  QwQ:1也可以当第一排
    layerShown(){return true},
    effectDescription(){return `点数获取*${format(this.effect())}.`},
    effect(){return n(1.5).pow(player.esc.points.pow(2))},
    /* upgrades:{
        11:{
            description:`点数加成自身.`,
            effect(){
                var eff = player.points.add(1).log10().add(1)
                return eff
            },
            effectDisplay(){return `x ${format(this.effect())}`},
            cost:n(4),
            unlocked(){return hasUpgrade(this.layer,this.id-1)},
        },
    }, */
    clickables: {
        11: {
            canClick(){return true},
            display() {return `长按以重置(手机端qol)`},
            onHold(){
                doReset(this.layer)
            },
        },
    },
    milestones:{
        1:{
            requirementDescription: "1劝退点",
            effectDescription: "5.过多的重复基础内容,又可以叫做大转(指低加成但重置的内容多,又不得不重置).解锁更~多~的升级.(?)",
            done() { return isUnl(1) }
        },
        2:{
            requirementDescription: "2劝退点",
            effectDescription: "解锁更~~~多~~~的升级.(?)",
            done() { return isUnl(2) }
        },
    },
    hotkeys: [
        {
            key: "esc", // What the hotkey button is. Use uppercase if it's combined with shift, or "ctrl+x" for holding down ctrl.
            description: "esc:ESC转", // The description of the hotkey that is displayed in the game's How To Play tab
            onPress() { if (player.esc.unlocked) doReset("esc") },
        }
    ],
})
