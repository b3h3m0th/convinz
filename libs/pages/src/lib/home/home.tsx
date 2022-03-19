import './home.scss';

/* eslint-disable-next-line */
export interface HomeProps {}

export const Home: React.FC<HomeProps> = (props: HomeProps) => {
  return (
    <div className="home">
      <h1>home</h1>
    </div>
  );
};

export default Home;
