import { EditUserSchema } from '@blog/contracts'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type UseFormProps } from 'react-hook-form'
import { z } from 'zod'

export const useEditUserFormSchema = EditUserSchema.extend({
  name: z.string().min(1, '이름을 입력해 주세요.'),
  intro: z.string().max(50, '소개는 최대 50자까지 입력할 수 있습니다.'),
  instagramId: z.string(),
  githubId: z.string(),
  personalUrl: z.url('올바른 URL 형식으로 입력해 주세요.'),
})

export type EditUserFormSchema = z.infer<typeof useEditUserFormSchema>

export const useEditUserForm = () => {
  const formOptions: UseFormProps<EditUserFormSchema> = {
    resolver: zodResolver(useEditUserFormSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      intro: '',
      instagramId: '',
      githubId: '',
      personalUrl: '',
    },
  }

  const form = useForm<EditUserFormSchema>(formOptions)
  return { ...form, schema: useEditUserFormSchema }
}
