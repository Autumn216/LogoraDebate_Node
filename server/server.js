const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
const compression = require('compression');
import router from './controllers/index';
import appMaintenanceMiddleware from './middlewares/appMaintenance';

app.use(cors());
app.use(express.json());
app.use(express.text())
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(appMaintenanceMiddleware);

app.use('/', router);

app.listen(port, () => {
    console.log('Logora Render module running on port ' + port);
})