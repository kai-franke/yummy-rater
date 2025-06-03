import { useRouter } from "next/router";

export default function AddForm() {
    const router = useRouter();
    const { ean } = router.query;
    return (
        <>
            <h1>Test</h1>
            <p>EAN: {ean}</p>
        </>)
}