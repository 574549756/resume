function zealot(id) {
    this.ID = id
}
zealot.prototype = {
    constructor: zealot,
    units: 'protossZealot',
    HP: 100,
    shield: 60,
    shieldDefense: 0,
    damage: 8,
    damageMode: 'duo',
    armor: 1,
    trainingTime: 40,
    damageAnimation:function(){
        that = this
        if(that.damageMode === 'duo'){
            that.damage = that.damage * 2
            console.log(that)
        }
    },
    damageUpdate: function () {
        this.damage += 2
        console.log('当前攻击力')
        console.log(this.damage)
    },
    armorUpdate: function () {
        this.armor += 1
        console.log('当前防御力')
        console.log(this.armor)
    },
    shieldUpdate: function(){
        this.shieldDefense += 1
        console.log('当前护盾抵御')
        console.log(this.shieldDefense)
    }
}

var Artanis = new zealot('Artanis')
Artanis.armorUpdate()
Artanis.damageUpdate()
Artanis.shieldDefense()

