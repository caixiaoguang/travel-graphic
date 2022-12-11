const tilesetList = ref([])
const photoList = ref([])
const vectorList = ref([])
const videoList = ref([])

function useLayerList() {
  fetch(`${window.baseUrl}config.json`)
    .then((res) => res.json())
    .then((res) => {
      tilesetList.value = res['3dtiles']
      photoList.value = res['720']
      vectorList.value = res['vector']
      videoList.value = res['video']
    })

  return { photoList, tilesetList, vectorList, videoList }
}

export default useLayerList
