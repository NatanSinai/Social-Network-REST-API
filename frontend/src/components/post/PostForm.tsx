import { postFormSchema, type PostFormValues } from '@entities';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Stack, TextField } from '@mui/material';
import type { FC } from 'react';
import { useForm } from 'react-hook-form';

export type PostFormProps = {
  defaultValues?: Partial<PostFormValues>;
  onSubmit: (values: PostFormValues) => void;
  submitLabel?: string;
  isSubmitting?: boolean;
};

export const PostForm: FC<PostFormProps> = ({
  defaultValues,
  onSubmit,
  submitLabel = 'Submit',
  isSubmitting = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostFormValues>({ resolver: zodResolver(postFormSchema), defaultValues });

  // TODO: Add characters counter

  // TODO: Make helper text (error) not move entire field

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={1} justifyContent='center' alignItems='center'>
        <Stack spacing={3} width='100%' p={1} py={2}>
          <TextField
            label='Title'
            {...register('title')}
            error={!!errors.title}
            helperText={errors.title?.message}
            fullWidth
          />

          <TextField
            label='Content'
            {...register('content')}
            error={!!errors.content}
            helperText={errors.content?.message}
            multiline
            minRows={2}
            maxRows={4}
            fullWidth
          />

          <TextField
            label='Image URL'
            {...register('imageURL')}
            error={!!errors.imageURL}
            helperText={errors.imageURL?.message}
            fullWidth
          />
        </Stack>

        <Button type='submit' variant='contained' disabled={isSubmitting}>
          {submitLabel}
        </Button>
      </Stack>
    </form>
  );
};
