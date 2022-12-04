const layerList = ref([])
const photoList = ref([])

function useLayerList() {
  fetch(`${window.baseUrl}config.json`)
    .then((res) => res.json())
    .then((res) => {
      layerList.value = res['3dtiles']
      photoList.value = res['720']
    })

  return { layerList, photoList }
}

export default useLayerList
