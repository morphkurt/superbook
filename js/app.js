
var root = new Vue({
    el: "#root",
    data: {
        seasons: null,
        x: 0,
        y: 0,
        dragging: false,
        index: 0,
        src: "",
        selectedVideo: {},
        showModal: true,
        seasonEpisodes: []
    },
    mounted: function () {
        this.getEpisodes();
    },
    computed: {

    },
    methods: {
        play: function () {
            let src = this.src.src
            let live = false;
            let debugVideoHud = false;
            fetch(`http://192.168.88.217:8060/launch/63218?live=${live}&autoCookie=false&debugVideoHud=${debugVideoHud}&url=${encodeURIComponent(src)}&fmt=Auto&drmParams=%7B%7D&headers=%7B%7D&metadata=%7B%22isFullHD%22%3Afalse%7D&cookies=%5B%5D`, {
                "headers": {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
                    "cache-control": "no-cache",
                    "pragma": "no-cache",
                },
                "referrer": "http://devtools.web.roku.com/stream_tester/html/",
                "referrerPolicy": "no-referrer-when-downgrade",
                "body": null,
                "method": "POST",
                "mode": "no-cors"
            });
        },
        close: function () {
            this.showModal = false
            var modal = document.getElementById("modal")
            modal.classList.remove("is-active");
        },
        onClick: function (event) {
            this.getBrightcoveUrl(event.mid)

            this.showModal = true;

            var modal = document.getElementById("modal")
            modal.classList.add("is-active");


        },
        getBrightcoveUrl: async function (videoId) {
            fetch("https://edge.api.brightcove.com/playback/v1/accounts/1519050004001/videos/" + videoId, {
                "headers": {
                    "Accept": "application/json;pk=BCpkADawqM1n-64tKO6BqPQEO3zIzzcHHvc_ueDMe3PhIlwIxLLYao6JHi8J6BE_nX1BhESuUfYak473bwW70JLo4sEMtaE6cL6vRyDZAjmm8niybKCUj1JYkvCvtxzke2AcgAcpMs-44QoK",
                    "Accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
                },
                "method": "GET"
            }).then(response => response.text())
                .then(result => {
                    this.selectedVideo = JSON.parse(result)
                    source = JSON.parse(result).sources.filter((w) => {
                        return (w.container == "M2TS")
                    })[0]
                    var options = {};
                    var player = videojs('my-player');
                    let src = source.src.replace('http://','https://') + "&secure=true"
                    this.src = source
                    let type = source.type
                    player.src({
                        src,
                        type
                    })
                })
                .catch(error => {
                    console.log('error', error)
                }
                );

        },
        getEpisodes: function () {
            var myHeaders = new Headers();

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch("https://us-en.superbook.cbn.com/a/episodes", requestOptions)
                .then(response => response.text())
                .then(result => {
                    this.seasons = JSON.parse(result);
                })
                .catch(error => console.log('error', error));
        }
    }
})

function objSlice(obj, lastExclusive) {
    var filteredKeys = Object.keys(obj).slice(0, lastExclusive);
    var newObj = {};
    filteredKeys.forEach(function (key) {
        newObj[key] = obj[key];
    });
    return newObj;
}