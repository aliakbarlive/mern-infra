import React from 'react';
import { useParams } from 'react-router-dom';

export const PostPage: React.FC = () => {
  const { id } = useParams();
  return <div>Post detail for {id}</div>;
};
