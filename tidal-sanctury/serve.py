"""Local standalone scene preview with precompressed delivery; standard library only."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlsplit
import argparse

ROOT=Path(__file__).resolve().parent
class Handler(SimpleHTTPRequestHandler):
    def __init__(self,*args,**kwargs):
        super().__init__(*args,directory=str(ROOT),**kwargs)
    def scene(self,head=False):
        if urlsplit(self.path).path not in ('/','/index.html','/dist/tidal-sanctuary.html'):
            return False
        accept=self.headers.get('Accept-Encoding','')
        enc='br' if 'br' in accept else 'gzip' if 'gzip' in accept else ''
        suffix='.br' if enc=='br' else '.gz' if enc=='gzip' else ''
        path=ROOT/'dist'/('tidal-sanctuary.html'+suffix)
        if not path.exists(): path=ROOT/'index.html';enc=''
        payload=path.read_bytes()
        self.send_response(200)
        self.send_header('Content-Type','text/html; charset=utf-8')
        self.send_header('Content-Length',str(len(payload)))
        self.send_header('Cache-Control','no-cache')
        self.send_header('Vary','Accept-Encoding')
        if enc:self.send_header('Content-Encoding',enc)
        self.end_headers()
        if not head:self.wfile.write(payload)
        return True
    def do_GET(self):
        if not self.scene():super().do_GET()
    def do_HEAD(self):
        if not self.scene(True):super().do_HEAD()

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--port',type=int,default=5192);args=p.parse_args()
    print(f'Tidal Sanctuary: http://127.0.0.1:{args.port}/',flush=True)
    ThreadingHTTPServer(('127.0.0.1',args.port),Handler).serve_forever()
