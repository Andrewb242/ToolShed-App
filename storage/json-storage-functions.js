
globalKey = 'ToolShed'

import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getAllData() {

    try {
        let data = await AsyncStorage.getItem(globalKey);
        if (data === null) {
            purgeData()
            data = await AsyncStorage.getItem(globalKey)
        }
        return JSON.parse(data)
      } catch (error) {
        console.log(Error(error))
      }
}

export async function purgeData() {
    try {
        const baseDataObject = {
            jobs: [
    
            ],
            equipment: [
    
            ]
        }

        const baseData = JSON.stringify(baseDataObject)

        await AsyncStorage.setItem(globalKey, baseData);
      } catch (error) {
        console.log(Error(error))
      }
}

export async function getJobById(id) {
    try {
        const data = await getAllData()
        const jobs = data.jobs

        const numericId = typeof id === 'string' ? parseInt(id, 10) : id

        const job = jobs.find(job => job.jobId === numericId)
        return job

    } catch (error) {
        console.log(Error(error))
    }
}

export async function getEquipment() {
    try {
        const data = await getAllData()
        return data.equipment

    } catch (error) {
        console.log(Error(error))
    }
}

export async function getJobsSorted() {
    try {
        const data = await getAllData()
        let activeJobs = []
        let inactiveJobs = []
        
        data.jobs.forEach(job => {
            if (job.jobActive === true) {
                activeJobs = [...activeJobs, job]
            } else {
                inactiveJobs = [...inactiveJobs, job]
            }
        })

        return [
            {
                title: 'Active Jobs',
                data: activeJobs
            },
            {
                title: 'Inactive Jobs',
                data: inactiveJobs
            }
        ]

    } catch (error) {
        console.log(Error(error))
    }
}

export async function createNewJob() {
    try {

        let existingData = await getAllData()
        const existingJobs = existingData.jobs
        
        const newJob = {
            jobId: existingJobs.length + 1,
            jobName: 'New Job',
            jobAddress: '',
            jobPhone: '',
            jobDate: '',
            jobEquipment: [],
            jobNote: '',
            jobActive: true,
            quoteData: [
                { id: 1, expectedExpense: '', cost: '' }, 
            ],
            billData: [
                { id: 1, expectedExpense: '', cost: '' }, 
            ]
        }

        existingData.jobs = [...existingData.jobs, newJob]

        console.log(existingData)
        await AsyncStorage.setItem(globalKey, JSON.stringify(existingData))
        
    } catch (error) {
        console.log(Error(error))
    }
}