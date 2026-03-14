import { Router } from "express";
import express from 'express';
import MWroute from './MW';
import BTSroute from "./bts";

const router = Router();

router.use(MWroute, BTSroute);

export default router;