import Spinner from '~/components/Spinner';

const SuspenseWrapper = ({ path }) => {
    const LazyComponent = React.lazy(() => import(`~/${path}`));

    return (
        <Suspense fallback={<Spinner fontSize="2rem" />}>
            <LazyComponent />
        </Suspense>
    );
};

export default SuspenseWrapper;
