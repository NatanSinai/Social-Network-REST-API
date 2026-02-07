import { createComment, getCommentsByPostId } from '@/api/comment';
import { queryKeys } from '@/api/queryKeys';
import { GenericDialog } from '@components';
import { CircularProgress, Divider, List, Typography } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type FC } from 'react';
import { AddCommentForm } from './AddCommentForm';
import { CommentItem } from './CommentItem';

export type CommentsDialogProps = {
  postId: string;
  isOpen: boolean;
  onClose: () => void;
};

export const CommentsDialog: FC<CommentsDialogProps> = ({ postId, isOpen, onClose }) => {
  const queryClient = useQueryClient();

  const { data: comments, isLoading } = useQuery({
    queryKey: queryKeys.comments.byPostId(postId),
    queryFn: () => getCommentsByPostId(postId),
    enabled: isOpen,
  });

  const { mutateAsync: addComment, isPending: isAddingComment } = useMutation({
    mutationFn: (content: string) => createComment({ postId, content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.comments.byPostId(postId) });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  return (
    <GenericDialog
      isOpen={isOpen}
      onClose={onClose}
      title='Comments'
      dialogProps={{ maxWidth: 'sm', fullWidth: true }}
    >
      {isLoading ? (
        <CircularProgress sx={{ display: 'block', m: 'auto', my: 4 }} />
      ) : (
        <>
          <List sx={{ maxHeight: '60vh', overflowY: 'auto', py: 0 }}>
            {comments?.length === 0 ? (
              <Typography sx={{ py: 4, textAlign: 'center' }} color='text.secondary'>
                No comments yet. Be the first to comment!
              </Typography>
            ) : (
              comments?.map((comment) => <CommentItem key={comment.id} comment={comment} />)
            )}
          </List>

          <Divider sx={{ my: 2 }} />

          <AddCommentForm
            onSubmit={async (content) => {
              await addComment(content);
            }}
            isLoading={isAddingComment}
          />
        </>
      )}
    </GenericDialog>
  );
};
