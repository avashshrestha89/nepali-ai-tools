import formidable from 'formidable'
import fs from 'fs'
import FormData from 'form-data'
import fetch from 'node-fetch'

export const config = {
  api: { bodyParser: false },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const form = formidable({ maxFileSize: 25 * 1024 * 1024 })

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'File upload failed: ' + err.message })

    const file = Array.isArray(files.audio) ? files.audio[0] : files.audio
    if (!file) return res.status(400).json({ error: 'No audio file received' })

    const style = Array.isArray(fields.style) ? fields.style[0] : (fields.style || 'devanagari')

    try {
      const formData = new FormData()
      formData.append('file', fs.createReadStream(file.filepath), {
        filename: file.originalFilename || 'audio.mp4',
        contentType: file.mimetype || 'audio/mpeg',
      })
      formData.append('model', 'whisper-large-v3')
      formData.append('language', 'ne')
      formData.append('response_format', 'verbose_json')
      formData.append('timestamp_granularities[]', 'segment')

      const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          ...formData.getHeaders(),
        },
        body: formData,
      })

      if (!response.ok) {
        const errText = await response.text()
        return res.status(500).json({ error: 'Groq API error: ' + errText })
      }

      const data = await response.json()

      if (!data.segments || data.segments.length === 0) {
        return res.status(400).json({ error: 'No speech detected in the audio. Please check the file.' })
      }

      const srt = convertToSRT(data.segments, style)

      res.setHeader('Content-Type', 'text/plain; charset=utf-8')
      res.setHeader('Content-Disposition', 'attachment; filename="nepali_subtitles.srt"')
      return res.send(srt)
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  })
}

function convertToSRT(segments, style) {
  return segments
    .map((seg, i) => {
      const start = formatTime(seg.start)
      const end = formatTime(seg.end)
      const text = style === 'romanized' ? toRomanized(seg.text.trim()) : seg.text.trim()
      return `${i + 1}\n${start} --> ${end}\n${text}`
    })
    .join('\n\n')
}

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  const ms = Math.round((seconds % 1) * 1000)
  return `${pad(h)}:${pad(m)}:${pad(s)},${pad(ms, 3)}`
}

function pad(n, len = 2) {
  return String(Math.floor(n)).padStart(len, '0')
}

function toRomanized(text) {
  const map = {
    'अ':'a','आ':'aa','इ':'i','ई':'ii','उ':'u','ऊ':'uu','ए':'e','ऐ':'ai','ओ':'o','औ':'au',
    'अं':'an','अः':'ah',
    'क':'k','ख':'kh','ग':'g','घ':'gh','ङ':'ng',
    'च':'ch','छ':'chh','ज':'j','झ':'jh','ञ':'ny',
    'ट':'t','ठ':'th','ड':'d','ढ':'dh','ण':'n',
    'त':'t','थ':'th','द':'d','ध':'dh','न':'n',
    'प':'p','फ':'ph','ब':'b','भ':'bh','म':'m',
    'य':'y','र':'r','ल':'l','व':'v','श':'sh','ष':'sh','स':'s','ह':'h',
    'क्ष':'ksh','त्र':'tr','ज्ञ':'gya',
    'ा':'a','ि':'i','ी':'ee','ु':'u','ू':'oo','े':'e','ै':'ai','ो':'o','ौ':'au',
    'ं':'n','ः':'h','्':'','ँ':'n',
    '।':'.','॥':'..','—':'-',
    '०':'0','१':'1','२':'2','३':'3','४':'4','५':'5','६':'6','७':'7','८':'8','९':'9',
  }
  let result = text
  Object.entries(map).forEach(([dev, rom]) => {
    result = result.split(dev).join(rom)
  })
  return result
}
