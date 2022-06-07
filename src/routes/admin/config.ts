import { Router } from "express";

import { ConfigController } from "../../controllers";

const router = Router();

// Config routes
router.post("/add", ConfigController.add);
router.post("/edit", ConfigController.edit);
router.post("/addMapEntry", ConfigController.addMapEntry);
router.post("/editMapEntry", ConfigController.editMapEntry);
router.post("/removeMapEntry", ConfigController.removeMapEntry);

export default router;
