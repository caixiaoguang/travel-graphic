
function useLayerList() {
  const tilesetList = ref([])
  const photoList = ref([])
  const vectorList = ref([])
  const videoList = ref([])
  const terrainUrl = ref('')
  
  fetch(`${window.baseUrl}config.json`)
    .then((res) => res.json())
    .then((res) => {
      tilesetList.value = res['3dtiles']
      photoList.value = res['720']
      vectorList.value = res['vector']
      videoList.value = res['video']
      terrainUrl.value = res['terrain']
    })

  return { photoList, tilesetList, vectorList, videoList, terrainUrl }
}

export default useLayerList
