import { writeFile, unlink, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { execSync } from 'child_process';

const recordingURL = process.argv[2];
const deskshareURL = `${recordingURL.replace('playback/', '').replace('2.3/', '')}/deskshare/deskshare.webm`;
const webcamsURL = `${recordingURL.replace('playback/', '').replace('2.3/', '')}/video/webcams.webm`;

console.log(deskshareURL);
console.log(webcamsURL);

if (!existsSync('output')) {
  await mkdir('output');
}

async function getFile (url, path) {
  console.log(`Downloading: ${url}`);

  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();

  await writeFile(path, Buffer.from(arrayBuffer));

  console.log('Done');
}

const [deskshare, webcams, audio] = ['./output/deskshare.webm', './output/webcams.webm', './output/audio.mp3'];
await getFile(deskshareURL, deskshare);
await getFile(webcamsURL, webcams);

execSync(`ffmpeg -i ${webcams} ${audio}`);
execSync(`ffmpeg -i ${deskshare} -i ${audio} -c:v copy -c:a aac ./output.mp4`);

await unlink(deskshare);
await unlink(webcams);
await unlink(audio);
