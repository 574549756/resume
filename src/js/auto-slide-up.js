!function () {
    //添加 offSet 类
    let specialTags = document.querySelectorAll('[data-x]')
    for (let i = 0; i < specialTags.length; i++) {
        specialTags[i].classList.add('offSet')
    }
    findClosestAndRemoveOffset()

    window.addEventListener('scroll', function (x) {
        findClosestAndRemoveOffset()
    })


    //helper
    function findClosestAndRemoveOffset() {
        let specialTags = document.querySelectorAll('[data-x]')
        let minIndex = 0
        for (let i = 0; i < specialTags.length; i++) {
            if (Math.abs(specialTags[i].offsetTop - window.scrollY) < Math.abs(specialTags[minIndex].offsetTop - window.scrollY)) {
                minIndex = i
            }
        }
        //minIndex 就是离窗口顶部最近的元素
        specialTags[minIndex].classList.remove('offSet')
        let tagsName = specialTags[minIndex].id
        let nameOfA = document.querySelector('a[href="#' + tagsName + '"]')
        let li = nameOfA.parentNode
        let brothersAndMe = li.parentNode.children
        for (let i = 0; i < brothersAndMe.length; i++) {
            brothersAndMe[i].classList.remove('highLight')
        }
        li.classList.add('highLight')
    }

    let liTags = document.querySelectorAll('nav.menu > ul > li')
    for (let i = 0; i < liTags.length; i++) {
        liTags[i].onmouseenter = function (x) {
            x.currentTarget.classList.add('active')
        }
        liTags[i].onmouseleave = function (x) {
            x.currentTarget.classList.remove('active')
        }
    }
}.call()
