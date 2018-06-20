!function () {
    var view = View('section.message')
    var model = Model({ resourceName: 'Message' })
    var controller = Controller({
        init: function(view, controller){
            this.messageList = view.querySelector('#messageList')            
            this.form = view.querySelector('form')
            this.loadMessages()
        },
        loadMessages: function () {
            this.model.fetch().then(
                (messages) => {
                    let array = messages.map((item) => item.attributes)
                    array.forEach((item) => {
                        let li = document.createElement('li')
                        li.innerText = `${item.name}: ${item.content}`
                        this.messageList.appendChild(li)
                    })
                }
            )
        },
        bindEvents: function () {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault()
                this.modifyContent()
            })
        },
        modifyContent: function () {
            let myForm = this.form
            let content = myForm.querySelector('input[name=content]').value.trim()
            let name = myForm.querySelector('input[name=name]').value.replace(" ", "")
            if (content !== '' && name !== '') {
                this.model.save({
                    'name': name, 'content': content
                }).then(function (object) {
                    let li = document.createElement('li')
                    li.innerText = `${object.attributes.name}: ${object.attributes.content}`
                    let messageList = document.querySelector('#messageList')
                    messageList.appendChild(li)
                    myForm.querySelector('input[name=content]').value = ''
                })
            }
        },
    })
    controller.init(view, model)
}.call()
