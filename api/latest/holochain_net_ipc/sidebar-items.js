initSidebarItems({"macro":[["bail_generic","Macro akin to `bail!()` but returns an IpcError::GenericError."]],"mod":[["context","This module uses lazy_static! to make the zmq::Context easier to work with Just make sure to call IpcClient::destroy_context() when ready"],["errors","This module holds net_ipc custom error types."],["ipc_client","implements a net_connection::NetWorker for messaging with an ipc p2p node"],["socket","This module is a thin wrapper around a ZMQ socket It allows us to easily mock it out for unit tests as well as manage context with lazy_static!"],["spawn","This is a helper function to manage spawning an IPC sub-process This process is expected to output some specific messages on its stdout that we can process to know its launch state"],["util","This module holds util functions, such as constructing time related values"]]});