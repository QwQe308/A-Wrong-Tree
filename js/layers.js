addLayer("p", { //这是代码中的节点代码 例如player.p可以调用该层级的数据 尽量使用顺手的字母什么的 不建议数字开头
    symbol: "P", // 这是节点上显示的字母
    position: 0, // 节点顺序
    startData() { return {
        unlocked: true, //是否开始就解锁
		points: new ExpantaNum(0),
        e0:n(0),
        e1:n(0),
        e2:n(0),
        e3:n(0),
        e4:n(0),
        e5:n(0),
        e6:n(0),
        e7:n(0),
        e8:n(0),
        e9:n(0),
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
        ${hasUpgrade("p",32)?`<br><br>重置能量:${format(player.p.e0)}(${format(upgradeEffect('p',32))}/s),使得重置点获取*${format(this.effect())}`:``}
        ${buyableEffect('p',13).gte(1)?`<br><br>一重压缩能量:${format(player.p.e1)}(${format(player.p.e0.pow(1/9).div(100).mul(this.condenseEffect(player.p.e2)))}/s),使得重置能量获取*${format(this.condenseEffect(player.p.e1))}`:``}
        ${buyableEffect('p',13).gte(2)?`<br><br>二重压缩能量:${format(player.p.e2)}(${format(player.p.e1.pow(1/9).div(100).mul(this.condenseEffect(player.p.e3)))}/s),使得一重压缩能量获取*${format(this.condenseEffect(player.p.e2))}`:``}
        ${buyableEffect('p',13).gte(3)?`<br><br>三重压缩能量:${format(player.p.e3)}(${format(player.p.e2.pow(1/9).div(100).mul(this.condenseEffect(player.p.e4)))}/s),使得二重压缩能量获取*${format(this.condenseEffect(player.p.e3))}`:``}
        ${buyableEffect('p',13).gte(4)?`<br><br>四重压缩能量:${format(player.p.e4)}(${format(player.p.e3.pow(1/9).div(100).mul(this.condenseEffect(player.p.e5)))}/s),使得三重压缩能量获取*${format(this.condenseEffect(player.p.e4))}`:``}
        `},
    effect(){
        var eff = player.p.e0.div(10).add(1).pow(2)
        return eff
    },
    condenseEffect(x){
        if(!x) return one
        var eff = x.div(10).add(1).pow(2)
        return eff
    },
    upgrades:{
        11:{
            description:`2.已经出现过无数遍的平淡开局.重置点加成点数.`,
            effect(){
                var eff = player.p.points.add(1).pow(0.66)
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
            unlocked(){return hasUpgrade(this.layer,this.id-1)||isUnl(1)},
        },
        13:{
            description:`每个升级使点数*1.75.`,
            effect(){
                var base = n(1.75)
                base = hasUpgThenMul(base,"p",24)
                var eff = base.pow(player.p.upgrades.length)
                var buyablePow = n(1)
                buyablePow = hasUpgThenAdd(buyablePow,this.layer,31)
                eff = eff.mul(buyableEffect("p",11).pow(buyablePow))
                return eff
            },
            effectDisplay(){return `x ${format(this.effect())}`},
            cost:n(16),
            unlocked(){return hasUpgrade(this.layer,this.id-1)||isUnl(1)},
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
            unlocked(){return hasUpgrade(this.layer,this.id-1)||isUnl(1)},
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
            unlocked(){return hasUpgrade(this.layer,this.id-1)||isUnl(1)},
        },
        21:{
            description:`6.过多/过强的升级成为仅有的增长方式,且游戏内容变化小时会造成很明显的时间墙.升级11效果+^0.25.`,
            effect(){
                var eff = n(0.25)
                eff = eff.mul(buyableEffect("p",11))
                return eff.min(0.75)
            },
            effectDisplay(){return `+^ ${format(this.effect())}(硬上限:+^0.75)`},
            cost:n(10086),
            unlocked(){return hasUpgrade(this.layer,15)&&isUnl(1)||isUnl(2)},
        },
        22:{
            description:`劝退1结束.p重置点获取指数+*0.25.`,
            effect(){
                var eff = n(0.25)
                eff = eff.mul(buyableEffect("p",11))
                return eff.min(0.75)
            },
            effectDisplay(){return `+* ${format(this.effect())}(硬上限:+*0.75)`},
            cost:n(23333),
            unlocked(){return hasUpgrade(this.layer,this.id-1)||isUnl(2)},
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
            unlocked(){return hasUpgrade(this.layer,this.id-1)||isUnl(2)},
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
            unlocked(){return hasUpgrade(this.layer,this.id-1)||isUnl(2)},
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
            unlocked(){return hasUpgrade(this.layer,this.id-1)||isUnl(2)},
        },
        31:{
            description:`加强升级15.前五个升级被购买项加成时,效果+^1.5`,
            effect(){
                var eff = n(1.5)
                eff = eff.mul(buyableEffect("p",11))
                eff = eff.mul(buyableEffect("p",21))
                if(hasChallenge('p',13)) eff = eff.mul(challengeEffect('p',13))
                return eff
            },
            effectDisplay(){return `+^ ${format(this.effect())}`},
            cost:n(1e16),
            unlocked(){return hasUpgrade(this.layer,25)&&isUnl(2)||isUnl(3)},
        },
        32:{
            description:`解锁重置能量.重置能量每秒获取量为:重置点^(1/18)/500`,
            effect(){
                var eff = player.points.pow(1/18).div(500)
                eff = eff.mul(buyableEffect("p",12)).mul(layers.p.condenseEffect(player.p.e1))
                if(hasUpgrade('p',34)) eff = eff.mul(upgradeEffect('p',34))
                return eff
            },
            effectDisplay(){return `+ ${format(this.effect())}/s`},
            cost:n(1e50),
            unlocked(){return hasUpgrade(this.layer,this.id-1)||isUnl(3)},
        },
        33:{
            description:`解锁一个有关压缩能量的购买项,压缩能量公式为x^(1/9)/100,但基于上一级能量.`,
            effect(){
                var eff = one
                return eff
            },
            effectDisplay(){return `+ ${format(this.effect())}`},
            cost:n(1e200),
            unlocked(){return hasUpgrade(this.layer,this.id-1)&&isUnl(3)||isUnl(4)||inChallenge('p',14)},
        },
        34:{
            description:`劝退点小幅度加成重置能量.`,
            effect(){
                var eff = n(1.8).pow(player.esc.points)
                if(hasUpgrade('p',35)) eff = eff.pow(upgradeEffect('p',35).add(1))
                return eff
            },
            effectDisplay(){return `* ${format(this.effect())}`},
            cost:n(1e308),
            unlocked(){return hasUpgrade(this.layer,this.id-1)||isUnl(4)||inChallenge('p',14)},
        },
        35:{
            description:`第一个购买项加成上一个升级.`,
            effect(){
                var eff = buyableEffect('p',11).sub(1)
                if(hasChallenge('p',14)) eff = eff.mul(challengeEffect('p',14))
                return eff
            },
            effectDisplay(){return `+^ ${format(this.effect())}`},
            cost:n('1e450'),
            unlocked(){return hasUpgrade(this.layer,this.id-1)||isUnl(4)||inChallenge('p',14)},
        },
    },
    update(diff){
        if(hasUpgrade("p",32)) player.p.e0 = player.p.e0.add(upgradeEffect("p",32).mul(diff))
        for(i=1;i<=buyableEffect('p',13).toNumber();i++) player.p[`e${i}`] = player.p[`e${i}`].add(player.p[`e${i-1}`].pow(1/9).div(100).mul(this.condenseEffect(player.p[`e${i+1}`])).mul(diff))
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
            rewardDescription:"每秒自动获取25%的重置点.在内容不多且操作量本身就小时,给予过多的qol和自动化.劝退4结束.",
            goalDescription:"获得1e6点数",
            canComplete(){return player.points.gte(1e6)},
            unlocked(){return hasUpgrade("p",23)},
        },
        12:{
            name: "C-2",
            challengeDescription: "加强后的升级12效果反转.(无论是否有升级12,加强后),进入挑战会让你的重置点清零.Tips:携带足够的重置能量进入.",
            rewardDescription:"升级12效果再次基于点数被加成.",
            rewardEffect(){
                var eff = player.points.add(1).log10().add(1).log10().add(1).pow(1.125)
                return eff
            },
            rewardDisplay(){return `^${format(this.rewardEffect())}`},
            goalDescription:"获得1e66点数",
            canComplete(){return player.points.gte(1e66)},
            unlocked(){return upgradeEffect('p',23).gte(2)},
            onEnter(){player.p.points = n(0)},
        },
        13:{
            name: "C-3",
            challengeDescription: "再次加强后的升级12效果反转.(无论是否有升级12,加强后),进入挑战会让你的重置点,重置能量以及第一购买项清零.",
            rewardDescription:"升级31效果基于重置点被加成.",
            rewardEffect(){
                var eff = player.p.points.add(1).log10().add(1).log10().div(10).add(1).pow(3)
                return eff
            },
            rewardDisplay(){return `*${format(this.rewardEffect())}`},
            goalDescription:"获得1e216点数",
            canComplete(){return player.points.gte(1e216)},
            unlocked(){return upgradeEffect('p',23).gte(3)||inChallenge('p',13)},
            onEnter(){
                player.p.points = n(0)
                player.p.e0 = n(0)
                player.p.buyables[11] = zero
            },
        },
        14:{
            name: "C-4",
            challengeDescription: "重置本层级的升级,购买项11,重置点数以及重置能量,并且只能购买10个升级.(超出则无法完成挑战)",
            rewardDescription:"升级35效果基于重置点被加成.",
            rewardEffect(){
                var eff = player.p.points.add(1).log10().add(1).log10().div(16).add(1).pow(3)
                return eff
            },
            rewardDisplay(){return `*${format(this.rewardEffect())}`},
            goalDescription:"获得e616点数",
            canComplete(){return player.points.gte('1e616')&&player.p.upgrades.length <= 10},
            unlocked(){return upgradeEffect('p',23).gte(4)||inChallenge('p',14)},
            onEnter(){
                player.p.points = n(0)
                player.p.e0 = n(0)
                player.p.buyables[11] = zero
                player.p.upgrades = []
            },
        },
    },
    buyables:{
        11: {
            cost(x = getBuyableAmount(this.layer, this.id)) {
                var c = n(1e10).mul(n(1e2).pow(x)).mul(n(2).pow(x.pow(2)))
                return c
            },
            display() { return `倍增前11个升级效果.<br />x${format(buyableEffect(this.layer,this.id),2)}.(下一级: ${format(this.effect(getBuyableAmount(this.layer, this.id).add(1)))})<br />费用:${format(this.cost(getBuyableAmount(this.layer, this.id)))}重置点<br>等级:${formatWhole(getBuyableAmount(this.layer, this.id))}` },
            canAfford() { return player.p.points.gte(this.cost()) },
            buy() {
                player.p.points = player.p.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x = getBuyableAmount(this.layer, this.id)){
                var eff = x.mul(1.6).add(1).root(3.6)
                eff = eff.mul(buyableEffect('p',14))
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
            canAfford() { return player.p.e0.gte(this.cost()) },
            buy() {
                player.p.e0 = player.p.e0.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x = getBuyableAmount(this.layer, this.id)){
                var eff = n(1.6).pow(x)
                return eff
            },
            unlocked(){return upgradeEffect("p",25).gte(2)},
        },
        13: {
            cost(x = getBuyableAmount(this.layer, this.id)) {
                var c = n(1e9)
                return c
            },
            display() { return `解锁下一重压缩能量.<br />当前重数:${format(buyableEffect(this.layer,this.id),2)}.(下一级: ${format(this.effect(getBuyableAmount(this.layer, this.id).add(1)))})<br />费用:${format(this.cost(getBuyableAmount(this.layer, this.id)))}当前最高重压缩能量<br>等级:${formatWhole(getBuyableAmount(this.layer, this.id))}/8` },
            canAfford() {
                return player.p[`e${buyableEffect('p',13).toNumber()}`].gte(this.cost())
            },
            buy() {
                player.p[`e${buyableEffect('p',13).toNumber()}`] = player.p[`e${buyableEffect('p',13).toNumber()}`].sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x = getBuyableAmount(this.layer, this.id)){
                var eff = x
                return eff
            },
            purchaseLimit:9,
            unlocked(){return hasUpgrade('p',33)},
        },
        14: {
            cost(x = getBuyableAmount(this.layer, this.id)) {
                var c = n(1e308).mul(n(1e49).pow(x)).mul(n(1e4).pow(x.pow(2)))
                return c
            },
            display() { return `倍增第一个购买项效果.<br />x${format(buyableEffect(this.layer,this.id),2)}.(下一级: ${format(this.effect(getBuyableAmount(this.layer, this.id).add(1)))})<br />费用:${format(this.cost(getBuyableAmount(this.layer, this.id)))}重置点<br>等级:${formatWhole(getBuyableAmount(this.layer, this.id))}` },
            canAfford() { return player.p.points.gte(this.cost()) },
            buy() {
                player.p.points = player.p.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x = getBuyableAmount(this.layer, this.id)){
                var eff = x.add(1).root(9.6)
                return eff
            },
            unlocked(){return upgradeEffect("p",25).gte(3)},
        },
        21: {
            cost(x = getBuyableAmount(this.layer, this.id)) {
                var c = n(1e100).mul(n(1e8).pow(x)).mul(n(100).pow(x.pow(2)))
                return c
            },
            display() { return `倍增升级31效果.<br />x${format(buyableEffect(this.layer,this.id),2)}.(下一级: ${format(this.effect(getBuyableAmount(this.layer, this.id).add(1)))})<br />费用:${format(this.cost(getBuyableAmount(this.layer, this.id)))}重置能量<br>等级:${formatWhole(getBuyableAmount(this.layer, this.id))}` },
            canAfford() { return player.p.e0.gte(this.cost()) },
            buy() {
                player.p.e0 = player.p.e0.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x = getBuyableAmount(this.layer, this.id)){
                var eff = x.add(1).root(9.6)
                return eff
            },
            unlocked(){return upgradeEffect("p",25).gte(4)},
        },
    },
    passiveGeneration(){
        if(hasChallenge("p",11)) return 0.25
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
        //gain = gain.min(1.79e308)
        return gain.floor()
    },
})

var escReq = [1e6,1e18,1e200,'e1000']
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
    exponent:0,
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
        3:{
            requirementDescription: "3劝退点",
            effectDescription: "解锁更~~~~~多~~~~~的升级.(?)",
            done() { return isUnl(3) }
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
