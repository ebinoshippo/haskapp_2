import { useState } from 'react'
import { cacheCreateTag } from '../cache/tagCache'

type TagFormProps = {
  userId: string
}

function TagForm({ userId }: TagFormProps) {
  const [name, setName] = useState('')
  const [color, setColor] = useState('#000000')

  async function handleCreateTag() {
    await cacheCreateTag(
      name,
      color,
      userId
    )

    setName('')
    setColor('#000000')
  }

  return (
    <div>
      <h2>Create Tag</h2>

      <div>
        <label>
          Name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          Color
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </label>
      </div>

      <button onClick={handleCreateTag}>
        Create Tag
      </button>
    </div>
  )
}

export default TagForm