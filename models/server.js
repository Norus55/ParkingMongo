import express,{json} from 'express'
import { dbConnect } from "../database/config.js";
import cellRoute from '../routes/cellRoute.js'

class Server {
    constructor() {
        this.app = express();
        this.pathCell = '/cells'

        this.route();
        this.dbConnection();
        this.listen();
    }
    async dbConnection() {
        await dbConnect();
    }

    route(){
        this.app.use(json())
        this.app.use(this.pathCell, cellRoute)
    }
    listen (){
        this.app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
            
        } )
    }
}

export default Server