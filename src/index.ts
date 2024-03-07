import 'reflect-metadata';
import './index.css';
import { createClient } from './services/client';

const client = createClient();

client.start();