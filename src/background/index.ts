import { useLogging } from "../use/useLogging"
import { onMessage } from "./onMessage"

useLogging().logging('background is running')

onMessage()
