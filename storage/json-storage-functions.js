
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
    
            ],
            trucks: [

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
            jobDate: new Date().toISOString().split('T')[0],
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

        await AsyncStorage.setItem(globalKey, JSON.stringify(existingData))
        
    } catch (error) {
        console.log(Error(error))
    }
}

export async function saveJobDataById(currentJobState, id) {
    try {

        let existingData = await getAllData()
        const numericId = typeof id === 'string' ? parseInt(id, 10) : id;

        if (!existingData.jobs.some(job => job.jobId === numericId)) {
            throw new Error(`Job with id ${id} not found`);
        }        

        currentJobState.jobDate = currentJobState.jobDate.replace(/\//g, '-')

        const newJobs = existingData.jobs.map((job) => {
            if (job.jobId === numericId) {
                return currentJobState
            }
            return job
        })

        existingData.jobs = newJobs

        await AsyncStorage.setItem(globalKey, JSON.stringify(existingData))
        
    } catch (error) {
        console.log(Error(error))
    }
}

export async function deleteJobDataById(id) {
    try {

        let existingData = await getAllData()
        const numericId = typeof id === 'string' ? parseInt(id, 10) : id

        if (!existingData.jobs.some(job => job.jobId === numericId)) {
            throw new Error(`Job with id ${id} not found`)
        }        

        const newJobsBadIds = existingData.jobs.filter(job => job.jobId === numericId)

        const newJobs = newJobsBadIds.map((job,key) => {job.jobId = key})

        existingData.jobs = newJobs

        await AsyncStorage.setItem(globalKey, JSON.stringify(existingData))
        
    } catch (error) {
        console.log(Error(error))
    }
}

// Inventory

export async function addEquipment(equipmentName) {
    try {

        let existingData = await getAllData()
        const existingEquipment = existingData.equipment

        if (existingEquipment.some(equipment => equipment === equipmentName)) {
            throw new Error(`${equipmentName} already exists`)
        }

        const newEquipment = [...existingEquipment, equipmentName]

        existingData.equipment = newEquipment

        await AsyncStorage.setItem(globalKey, JSON.stringify(existingData))

    } catch (error) {
        console.log(Error(error))
    }
}

export async function deleteEquipment(equipmentName) {
    try {

        let existingData = await getAllData()
        const existingEquipment = existingData.equipment

        if (!existingEquipment.some(equipment => equipment === equipmentName)) {
            throw new Error(`${equipmentName} doesn't exist`)
        }

        const newEquipment = existingEquipment.filter(equipment => equipment !== equipmentName)

        existingData.equipment = newEquipment

        await AsyncStorage.setItem(globalKey, JSON.stringify(existingData))

    } catch (error) {
        console.log(Error(error))
    }
}

// My Day

export async function getJobsByDay(date) {
    try {
        const existingData = await getAllData()

        const jobs = existingData.jobs.filter(job => job.jobDate === date)

        return jobs

    } catch (error) {
        console.log(Error(error))
    }
}

export async function addTruck(truckName) {
    try {

        let existingData = await getAllData()
        const existingTrucks = existingData.trucks

        if (existingTrucks.some(truck => truck === truckName)) {
            throw new Error(`${truckName} already exists`)
        }

        const newTrucks = [...existingTrucks, truckName]

        existingData.truck = newTrucks

        await AsyncStorage.setItem(globalKey, JSON.stringify(existingData))

    } catch (error) {
        console.log(Error(error))
    }
}

export async function deleteTruck(truckName) {
    try {

        let existingData = await getAllData()
        const existingTrucks = existingData.truckName

        if (!existingTrucks.some(truck => truck === truckName)) {
            throw new Error(`${truckName} doesn't exist`)
        }

        const newTrucks = existingTrucks.filter(truck => truck !== truckName)

        existingData.trucks = newTrucks

        await AsyncStorage.setItem(globalKey, JSON.stringify(existingData))

    } catch (error) {
        console.log(Error(error))
    }
}
