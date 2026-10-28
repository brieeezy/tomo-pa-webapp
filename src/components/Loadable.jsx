import LoadingScreen from "./LoadingScreen";

export default function Loadable({ loading, error, children }) {
  if (loading) return <LoadingScreen />;
  if (error) return <p role="alert">{error}</p>;
  return children;
}
