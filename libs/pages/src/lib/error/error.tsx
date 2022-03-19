import './error.scss';

/* eslint-disable-next-line */
export interface ErrorProps {}

export const Error: React.FC<ErrorProps> = (props: ErrorProps) => {
  return (
    <div className="error">
      <h1>error</h1>
    </div>
  );
};

export default Error;
