import { useState } from 'react'
import type { Tag } from '../types/app'
import {
  cacheUpdateTag,
  cacheDeleteTag,
} from '../cache/tagCache'

type TagListProps = {
  tags: Tag[]
}

function TagList({ tags }: TagListProps) {
    const [editingTagId, setEditingTagId] =
    useState<string | null>(null)

    const [editName, setEditName] = useState('')
    const [editColor, setEditColor] = useState('#000000')

    async function handleEditTag() {
    if (!editingTagId) {
        return
    }

    await cacheUpdateTag(
        editingTagId,
        editName,
        editColor
    )

    setEditingTagId(null)
    }
  return (
    <div>
      <h2>Tags</h2>

      {tags.map((tag) => (
        <div key={tag.id}>
          <span
            style={{
              display: 'inline-block',
              width: '16px',
              height: '16px',
              backgroundColor: tag.color,
              marginRight: '8px',
            }}
          />

          <span>{tag.name}</span>

          <button
            onClick={() => {
                setEditingTagId(tag.id)
                setEditName(tag.name)
                setEditColor(tag.color)
            }}
            >
            Edit
        </button>

          <button
            onClick={() => cacheDeleteTag(tag.id)}
          >
            Delete
          </button>
          {editingTagId === tag.id && (
            <div>
                <div>
                <label>
                    Name
                    <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    />
                </label>
                </div>

                <div>
                <label>
                    Color
                    <input
                    type="color"
                    value={editColor}
                    onChange={(e) => setEditColor(e.target.value)}
                    />
                </label>
                </div>

                <button onClick={handleEditTag}>
                Save
                </button>
            </div>
            )}
        </div>
      ))}
    </div>
  )
}

export default TagList