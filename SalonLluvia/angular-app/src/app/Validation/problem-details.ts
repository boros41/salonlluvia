// ASP.NET Core backend returns a ProblemDetails object based on this specification:
// https://www.rfc-editor.org/rfc/rfc9457
export default interface ProblemDetails {
    status: number;
    title?: string;
    detail: string;
    instance: string;
}