#include <node.h>
#include <nan.h>

extern "C" {
  #include "libkeccak/KeccakSponge.h"
}

class KeccakWrapper : public Nan::ObjectWrap {
 public:
  static v8::Local<v8::Function> GetConstructor () {
    v8::Local<v8::FunctionTemplate> tpl = Nan::New<v8::FunctionTemplate>(New);
    tpl->SetClassName(Nan::New("KeccakWrapper").ToLocalChecked());
    tpl->InstanceTemplate()->SetInternalFieldCount(1);

    Nan::SetPrototypeMethod(tpl, "initialize", Initialize);
    Nan::SetPrototypeMethod(tpl, "absorb", Absorb);
    Nan::SetPrototypeMethod(tpl, "absorbLastFewBits", AbsorbLastFewBits);
    Nan::SetPrototypeMethod(tpl, "squeeze", Squeeze);
    Nan::SetPrototypeMethod(tpl, "copy", Copy);

    return Nan::GetFunction(tpl).ToLocalChecked();
  }

 private:
  KeccakWidth1600_SpongeInstance sponge;

  static NAN_METHOD(New) {
    KeccakWrapper* obj = new KeccakWrapper();
    obj->Wrap(info.This());
    info.GetReturnValue().Set(info.This());
  }

  static NAN_METHOD(Initialize) {
    KeccakWrapper* obj = Nan::ObjectWrap::Unwrap<KeccakWrapper>(info.Holder());
    unsigned int rate = info[0]->IntegerValue();
    unsigned int capacity = info[1]->IntegerValue();

    int result = KeccakWidth1600_SpongeInitialize(&obj->sponge, rate, capacity);
    if (result != 0) return Nan::ThrowError("Invalid parameters");
  }

  static NAN_METHOD(Absorb) {
    KeccakWrapper* obj = Nan::ObjectWrap::Unwrap<KeccakWrapper>(info.Holder());
    v8::Local<v8::Object> buffer = info[0].As<v8::Object>();
    const unsigned char* data = (const unsigned char*) node::Buffer::Data(buffer);
    size_t length = node::Buffer::Length(buffer);

    int result = KeccakWidth1600_SpongeAbsorb(&obj->sponge, data, length);
    if (result != 0) return Nan::ThrowError("Too late for additional input");
  }

  static NAN_METHOD(AbsorbLastFewBits) {
    KeccakWrapper* obj = Nan::ObjectWrap::Unwrap<KeccakWrapper>(info.Holder());
    unsigned char bits = info[0]->IntegerValue();

    int result = KeccakWidth1600_SpongeAbsorbLastFewBits(&obj->sponge, bits);
    if (result != 0) return Nan::ThrowError("Too late for additional input");
  }

  static NAN_METHOD(Squeeze) {
    KeccakWrapper* obj = Nan::ObjectWrap::Unwrap<KeccakWrapper>(info.Holder());
    size_t length = info[0]->IntegerValue();

    v8::Local<v8::Object> buffer = Nan::NewBuffer(length).ToLocalChecked();
    unsigned char* data = (unsigned char*) node::Buffer::Data(buffer);

    KeccakWidth1600_SpongeSqueeze(&obj->sponge, data, length);
    info.GetReturnValue().Set(buffer);
  }

  static NAN_METHOD(Copy) {
    KeccakWrapper* from = Nan::ObjectWrap::Unwrap<KeccakWrapper>(info.Holder());
    KeccakWrapper* to = Nan::ObjectWrap::Unwrap<KeccakWrapper>(info[0].As<v8::Object>());

    memcpy(&to->sponge, &from->sponge, sizeof(KeccakWidth1600_SpongeInstance));
  }
};

NAN_MODULE_INIT(Init) {
  // I wish to use pure functions, but we need wrapper around state
  v8::Local<v8::Function> KeccakConstructor = KeccakWrapper::GetConstructor();
  Nan::Set(target, Nan::New("Keccak").ToLocalChecked(), KeccakConstructor);
}

NODE_MODULE(keccak, Init)
