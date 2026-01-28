import { uploadImage } from '@/shared/utils/upload-image'
import MDEditor, { commands, TextAreaTextApi, type TextState } from '@uiw/react-md-editor'
import { useEffect, useRef } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'

export const CustomEditor = () => {
  const { setValue, control } = useFormContext()
  const contents = useWatch({ control, name: 'content' })
  const editorRef = useRef<HTMLDivElement>(null)

  const handleChange = (value?: string) => {
    if (value !== undefined) {
      setValue('content', value)
    }
  }

  const uploadImageAndInsert = async (file: File) => {
    const url = await uploadImage(file, 'content')
    const insert = `![image](${url})`

    const newValue = (contents ?? '') + '\n' + insert
    setValue('content', newValue)
  }

  useEffect(() => {
    const handleDrop = async (e: DragEvent) => {
      e.preventDefault()
      if (!e.dataTransfer?.files?.length) return

      const file = e.dataTransfer.files[0]
      if (!file.type.startsWith('image/')) return

      await uploadImageAndInsert(file)
    }

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault()
    }

    const wrapper = editorRef.current
    if (wrapper) {
      wrapper.addEventListener('drop', handleDrop)
      wrapper.addEventListener('dragover', handleDragOver)
    }

    return () => {
      if (wrapper) {
        wrapper.removeEventListener('drop', handleDrop)
        wrapper.removeEventListener('dragover', handleDragOver)
      }
    }
  }, [contents, setValue])

  const imageHandler = (api: TextAreaTextApi, value?: string, onChange?: (val: string) => void) => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()

    input.addEventListener('change', async () => {
      const file = input.files?.[0]
      if (!file) return

      const url = await uploadImage(file, 'content')
      api.replaceSelection(url)

      if (onChange) {
        const newValue = (value ?? '') + '\n' + url
        onChange(newValue)
      }
    })
  }

  const customImageCommand = {
    name: 'image',
    keyCommand: 'image',
    buttonProps: { 'aria-label': 'Insert image' },
    icon: <i className="bi bi-image" />,
    execute: (_state: TextState, api: TextAreaTextApi) => {
      imageHandler(api, contents, handleChange)
    },
  }

  return (
    <div ref={editorRef}>
      <MDEditor
        data-color-mode="light"
        className="mt-5"
        value={contents}
        onChange={handleChange}
        height={800}
        commands={[...commands.getCommands(), customImageCommand]}
      />
    </div>
  )
}
