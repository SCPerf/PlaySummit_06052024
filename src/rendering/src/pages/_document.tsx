// TODO: Remove the below eslint disable when eslint-config-next is updated to support tsx files for that validation
// eslint-disable-next-line @next/next/no-document-import-in-page
import newrelic from "newrelic";
import Document, {
  DocumentContext,
  DocumentInitialProps,
  Html,
  Head,
  Main,
  NextScript,
} from "next/document";

type NewRelicProps = {
  browserTimingHeader: string;
};

class MyDocument extends Document<NewRelicProps> {
 static async getInitialProps(
   ctx: DocumentContext
 ): Promise<DocumentInitialProps & NewRelicProps> {
   const initialProps = await Document.getInitialProps(ctx);
 
   if (!newrelic.agent.collector.isConnected()) {
     await new Promise((resolve) => {
       newrelic.agent.on("connected", resolve);
     });
   }

   const browserTimingHeader = newrelic.getBrowserTimingHeader({
     hasToRemoveScriptWrapper: true,
     allowTransactionlessInjection: true,
   });

   return {
     ...initialProps,
     browserTimingHeader,
   };
 }
 
  render(): JSX.Element {
    return (
      <Html>
        <Head>
          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{ __html: this.props.browserTimingHeader }}
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Saira:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
