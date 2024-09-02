import express from 'express';
import path, { dirname } from 'path';
import compression from 'compression';
import bodyParser from 'body-parser';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const __package = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));

const dictPath = path.join(__dirname, '..', 'data', 'dict.json')
const ontoPath = path.join(__dirname, '..', 'data', 'onto.json')


let db = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'cats.json'))).filter(x => !parseInt(x.stem));
// console.log(db);

const ontology = {};
const dict = {};

db.forEach(el => {
  const item = { 'stem': el.stem, name: el.name };
  if (el.feature === 'wishful') {
    item['wishful'] = true;
  }
  if (el.type in ontology) {
    ontology[el.type].push(item)
  } else {
    ontology[el.type] = [item]
  }

  dict[el.name] = el.stem;
  // console.log(el.stem, el.type, el.feature);
});

// console.log(ontology);
// console.log(dict);
// fs.writeFileSync(dictPath, JSON.stringify(dict));

// fs.writeFileSync(ontoPath, JSON.stringify(ontology));

// environment variables
const port = process.env.PORT || 8080;
const appName = __package?.name || String(port);

const app = express();

app.use(compression());
app.set('trust proxy', 1);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(history());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api/dict', async (req, res) => {
  const data = fs.readFileSync(dictPath, "utf8");
  console.log(data);
  res.json(JSON.parse(data));
});

app.get('/api/onto', async (req, res) => {
  const data = fs.readFileSync(ontoPath, "utf8");
  console.log(data);
  res.json(JSON.parse(data));
});

app.post('/api/record', async (req, res) => {
  const word = req.body.word + '\n';
  res.send('ok');
});

app.listen(port);
console.log(`Backend is at port ${port}`);
