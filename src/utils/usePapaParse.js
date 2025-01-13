import { ref } from 'vue'
import Papa from 'papaparse';
import { shApis, shRepo } from '@iankibetsh/shframework'
const usePapaParse = (maps, postUrl)=>{
    const file = ref(null)

    const sampleRows = ref([])
    const fieldMaps = ref(maps ?? {
        phone: false
    })

    const rowCount = ref(0)
    const postedRows = ref(0)
    const progress = ref(0)
    const importing = ref(false)
    const setFile = (e)=>{
        file.value = e.target.files[0]
        parseFile()
    }
    const isCounting = ref(false)
    const rows = ref([])

    const parseFile = ()=>{
        isCounting.value = true
        Papa.parse(file.value, {
            worker: true,
            step: function(res) {
                rowCount.value++
                if(rowCount.value < 6){
                    sampleRows.value.push(res.data)
                }
            },
            complete: function(){
                isCounting.value = false
            }
        })
    }

    const startImport = async ()=>{
        console.log(fieldMaps.value)
        let chunk = []
        importing.value = true
        Papa.parse(file.value, {
            worker: true,
            step: async  function(res) {
                const data = res.data
                const row = {}
                for(let key in fieldMaps.value){
                        row[key] = data[fieldMaps.value[key]]
                }
                chunk.push(row)
                if(chunk.length === 50){
                    rows.value.push(chunk)
                    await postChunk(chunk)
                    chunk = []
                }
            },
            complete: async function(){
                rows.value.push(chunk)
                await postChunk(chunk)
            }
        })
    }

    const postChunk = async chunk=>{
        await shApis.doPost(postUrl, {
            'items': chunk
        }).then(res=>{
            postedRows.value += chunk.length
            progress.value = Math.floor(postedRows.value/(rowCount.value - 1) * 100)
            if(progress.value === 100){
                importing.value = false
            }
        }).catch(err=>{
            shRepo.showToast(err.message, 'error')
            importing.value = false
        })
    }

    return {
        file,
        setFile,
        fieldMaps,
        rows,
        isCounting,
        rowCount,
        sampleRows,
        progress,
        startImport,
        importing,
        postedRows
    }
}
export default usePapaParse
