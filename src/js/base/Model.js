window.Model = function (options) {
    let resourceName = options.resourceName
    return {
        init: function () {
            var APP_ID = 'e6VBXAwRkldfhC2vMQos77XR-gzGzoHsz';
            var APP_KEY = 'qen3v1q2121xwg6ahm1Ynvcd';
            AV.init({ appId: APP_ID, appKey: APP_KEY });
        },
        fetch: function () {
            var query = new AV.Query(resourceName)
            return query.find() //promise对象
        },
        save: function (object) {
            var X = AV.Object.extend(resourceName)
            var x = new X()
            return x.save(object)
        }
    }
}