const cds =require('@sap/cds')

class ProcessorService extends cds.ApplicationService{
    //registering custom event handlers
    init(){
        this.before("UPDATE","Incidents",(req)=>this.onUpdate(req));
        this.before("CREATE","Incidents",(req)=>this.changeUrgencyDueToSubject(req.data))
        
        return super.init();
    }

    changeUrgencyDueToSubject(data){
        if(data){
            const incidents=Array.isArray(data)?data:[data];
            console.log(incidents)
            incidents.forEach((incident)=>{
                if(incident.title?.toLowerCase().includes("urgent")){
                    incident.urgency={code:"H",descr:"High"};
                }
            })
        }
    }
    //validating if the service is closed or open 
    async onUpdate(req){
        const {status_code}= await SELECT.one(req.subject, i=> i.status_code).where({ID:req.data.ID})
        if(status_code === 'C'){
            return req.reject("can't modify a closed incident")
        }
    }
}
module.exports={ProcessorService}