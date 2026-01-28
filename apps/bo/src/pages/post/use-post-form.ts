import { CreatePostSchema } from '@blog/contracts'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type UseFormProps } from 'react-hook-form'
import { z } from 'zod'

export const CreatePostSchemaWithMessage = CreatePostSchema.extend({
  title: z
    .string()
    .min(1, '제목은 필수 입력사항입니다.')
    .max(100, '제목은 최대 100자까지 입력 가능합니다.'),
  content: z.string().min(1, '내용은 필수 입력사항입니다.'),
  tags: z.array(z.string()).max(10, '태그는 최대 10개까지 등록 가능합니다.'),
  category: z.string().min(1, '카테고리는 필수 입력사항입니다.'),
})
export type CreatePostForm = z.infer<typeof CreatePostSchemaWithMessage>

export const useCreateForm = () => {
  const formOptions: UseFormProps<CreatePostForm> = {
    resolver: zodResolver(CreatePostSchemaWithMessage),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      title: '',
      category: '',
      tags: [],
      content: '',
    },
  }

  const form = useForm<CreatePostForm>(formOptions)
  return { ...form, schema: CreatePostSchemaWithMessage }
}
