function formatDate(date) {
    date = date.split(/[-\/]/)
    return date[1] + '/' + date[2] + '/' + date[0]
  }

export default function formatJob(jobData) {
    const name = jobData.jobName
    const address = jobData.jobAddress
    const phone = jobData.jobPhone
    const scheduledDate = jobData.jobDate
    const quoteArray = jobData.quoteData
    const billArray = jobData.billData

    const dateObject = new Date()
    const fetchedDate = `${(dateObject.getMonth() + 1).toString().padStart(2, '0')}/${dateObject.getDate().toString().padStart(2, '0')}/${dateObject.getFullYear()}`

    let output = `"${name}",,,,Logged Date:,${fetchedDate}\n`
    output += `"Client Address:","${address}","Client Phone:","${phone}","Scheduled Date:","${formatDate(scheduledDate)}"\n\n`
    output += `"Quote Information",,,,,\n`
    output += `"Item","Expected Expense",,,,"Cost"\n`

    quoteArray.forEach((quote, index) => {
        output += `"${index + 1}","${quote.expectedExpense}",,,,"$${quote.cost}"\n`
    })

    output += `\n"Bill Information",,,,,\n`
    output += `"Item","Expected Expense",,,,"Cost"\n`

    billArray.forEach((bill, index) => {
        output += `"${index + 1}","${bill.expectedExpense}",,,,"$${bill.cost}"\n`
    })

    return output
}